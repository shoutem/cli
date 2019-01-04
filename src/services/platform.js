import url from 'url';
import path from 'path';
import _ from 'lodash';
import fs from 'fs-extra';
import replace from 'replace-in-file';

import cliUrls from '../../config/services';
import appManager from '../clients/app-manager';
import extensionManager from '../clients/extension-manager';
import { getRefreshToken, createAppAccessToken } from '../clients/auth-service';
import { readJsonFile, writeJsonFile } from './data';
import { decompressFromUrl } from './decompress';
import commandExists from './command-exists';
import { ensureYarnInstalled } from './yarn';
import reactNative from './react-native';
import analytics from './analytics';
import npm from './npm';

function isPlatformDirectory(dir) {
  const { name } = readJsonFile(path.join(dir, 'package.json')) || {};

  // platform package was renamed with Platform release v1.1.10
  return name === '@shoutem/mobile-app' || name === '@shoutem/platform';
}

export function getPlatformRootDir(dir = process.cwd(), { shouldThrow = true } = {}) {
  if (isPlatformDirectory(dir)) {
    return dir;
  }

  const parentDir = path.resolve(dir, '..');

  if (parentDir === dir) {
    if (shouldThrow) {
      throw new Error('Not a platform directory');
    } else {
      return null;
    }
  }

  return getPlatformRootDir(parentDir, { shouldThrow });
}

export function getPlatformExtensionsDir(dir = null) {
  return path.join(dir || getPlatformRootDir(), 'extensions');
}

export async function createPlatformConfig(platformDir, opts) {
  const configTemplate = readJsonFile(path.join(platformDir, 'config.template.json'));
  let authorization;

  try {
    const refreshToken = await getRefreshToken();
    authorization = await createAppAccessToken(opts.appId, refreshToken);
  } catch (err) {
    if (err.code === 401 || err.code === 403) {
      err.message = 'Not authorized to create application token. You must log in again using `shoutem login` command.';
    }
    throw err;
  }

  const serverApiEndpoint = url.parse(cliUrls.appManager).hostname;
  const legacyApiEndpoint = url.parse(cliUrls.legacyService).hostname;

  return {
    ...configTemplate,
    ...opts,
    authorization,
    serverApiEndpoint,
    legacyApiEndpoint,
    configurationFilePath: 'config.json',
  };
}

export function getPlatformConfig(platformDir = null) {
  return readJsonFile(path.join(platformDir || getPlatformRootDir(), 'config.json'));
}

export function setPlatformConfig(platformDir, mobileConfig) {
  writeJsonFile(path.join(platformDir, 'config.json'), mobileConfig);
}

export async function configurePlatform(platformDir) {
  await ensureYarnInstalled();
  await reactNative.ensureInstalled();

  if (process.platform === 'darwin' && !await commandExists('pod')) {
    throw new Error('Missing `pods` command. Please install cocoapods and run `shoutem configure` in the ' +
      `${platformDir} directory`);
  }

  if (!getPlatformConfig(platformDir)) {
    throw new Error('Missing config.json file');
  }

  await npm.install(path.join(platformDir, 'scripts'));
  await npm.run(platformDir, 'configure');
}

export function fixPlatform(platformDir, appId) {
  const appBuilderPath = path.join(platformDir, 'scripts', 'classes', 'app-builder.js');

  if (process.platform === 'win32') {
    try {
      replace.sync({
        files: appBuilderPath,
        from: './gradlew',
        to: 'gradlew',
      });
    } catch (err) {
      console.log('WARN: Could not rename ./gradle to gradle');
    }

    try {
      replace.sync({
        files: appBuilderPath,
        from: "const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk');",
        to: `const apkPath = path.join('c:/', '${appId}', 'tmp', 'ShoutemApp', 'app', 'outputs', 'apk');`,
      });
    } catch (err) {
      console.log('WARN: Could not adapt client for c:\\tmp build directory');
    }

    try {
      replace.sync({
        files: path.join(platformDir, 'android', 'build.gradle'),
        from: '//<CLI> buildDir = "C:/tmp/',
        to: `buildDir = "C:/tmp/${appId}/`,
      });
    } catch (err) {
      console.log('WARN: Could not set the tmp build directory for android app');
    }
  }
}

function pullPlatform(location, version, destination, options) {
  const platformUrl = !!location ? location : `${cliUrls.mobileAppUrl}/archive/v${version}.tar.gz`;
  return decompressFromUrl(platformUrl, destination, { ...options, strip: 1, useCache: options.useCache });
}

export async function downloadApp(appId, destinationDir, options = {}) {
  analytics.setAppId(appId);
  
  const versionCheck = options.versionCheck || (() => {});
  
  const platformInstallationData = await appManager.getApplicationPlatform(appId, true);
  const { platform: platformId, mobileAppVersion } = platformInstallationData;

  const platform = await extensionManager.getPlatform(platformId);

  await versionCheck(mobileAppVersion);
  await pullPlatform(platform.location, mobileAppVersion, destinationDir, options);

  if (!fs.pathExistsSync(destinationDir)) {
    throw new Error('Platform code could not be downloaded. Make sure that platform is setup correctly.');
  }
}

export async function addToExtensionsJs(platformDir, extensionPath) {
  const { name } = npm.getPackageJson(path.join(extensionPath, 'app'));

  const extensionsJsPath = path.join(platformDir, 'extensions.js');
  let extensionsJsData = fs.readFileSync(extensionsJsPath, 'utf8');

  if (_.includes(extensionsJsData, `'${name}'`)) {
    return;
  }

  extensionsJsData = extensionsJsData.replace('};', `'${name}': require('${name}'),`);
  extensionsJsData += '  };\n';

  fs.writeFileSync(extensionsJsPath, extensionsJsData);
}

export async function linkLocalExtension(platformDir, extensionPath) {
  npm.addLocalDependency(platformDir, path.join(extensionPath, 'app'));
  await npm.linkLocalDependencies(platformDir);
  await npm.install(platformDir);
}
