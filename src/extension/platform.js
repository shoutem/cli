import url from 'url';
import path from 'path';
import glob from 'glob-promise';
import replace from 'replace-in-file';
import { getLinkedDirectories } from './linker';
import * as appManager from '../clients/app-manager';
import decompressUri from './decompress';
import cliUrls from '../../config/services';
import { writeJsonFile, readJsonFile } from './data';
import * as npm from './npm';
import { ensureUserIsLoggedIn } from '../commands/login';
import { ensureYarnInstalled } from './yarn';
import * as reactNative from './react-native';
import * as analytics from './analytics';

async function isPlatformDirectory(dir) {
  const { name } = await readJsonFile(path.join(dir, 'package.json')) || {};

  return name === '@shoutem/mobile-app';
}

export async function getPlatformRootDir(dir = process.cwd()) {
  if (await isPlatformDirectory(dir)) {
    return dir;
  }

  const parentDir = path.join(dir, '..');

  if (parentDir === dir) {
    return null;
  }
  return await getPlatformRootDir(parentDir);
}

export async function getExtensionsPaths(platformDir) {
  return await glob(path.join(platformDir, 'extensions', '*', 'app'));
}

export async function createMobileConfig(platformDir, opts) {
  const {
    platform,
    appId,
    debug = true,
    excludePackages,
    production,
    linkLocalExtensions,
    skipNativeDependencies,
    offlineMode
  } = opts;

  return {
    platform,
    appId: appId.toString(),
    serverApiEndpoint: url.parse(cliUrls.appManager).hostname,
    legacyApiEndpoint: url.parse(cliUrls.legacyService).hostname,
    authorization: await ensureUserIsLoggedIn(),
    configurationFilePath: 'config.json',
    workingDirectories: linkLocalExtensions ? await getExtensionsPaths(platformDir) : await getLinkedDirectories(),
    excludePackages: excludePackages || ['shoutem.code-push'],
    debug,
    extensionsJsPath: "./extensions.js",
    production: !!production,
    skipNativeDependencies: !!skipNativeDependencies,
    offlineMode: !!offlineMode
  };
}

export async function preparePlatform(platformDir, mobileConfig) {
  await ensureYarnInstalled();
  await reactNative.ensureInstalled();

  const configPath = path.join(platformDir, 'config.json');

  await writeJsonFile(mobileConfig, configPath);
  await npm.install(path.join(platformDir, 'scripts'));
  await npm.run(platformDir, 'configure');
}

export async function buildPlatform(platformDir, platform, outputDir = process.cwd()) {
  await npm.run(platformDir, 'build', [
    '--platform', platform,
    '--outputDirectory', outputDir
  ]);
}

export async function fixPlatform(platformDir, appId) {
  const appBuilderPath = path.join(platformDir, 'scripts', 'classes', 'app-builder.js');

  if (process.platform === 'win32') {
    try {
      await replace({
        files: appBuilderPath,
        from: './gradlew',
        to: 'gradlew'
      });
    } catch (err) {
      console.log('WARN: Could not rename ./gradle to gradle');
    }

    try {
      await replace({
        files: appBuilderPath,
        from: "const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk');",
        to: "const apkPath = path.join('c:/', 'tmp', 'ShoutemApp', 'app', 'outputs', 'apk');"
      });
    } catch (err) {
      console.log('WARN: Could not adapt client for c:\\tmp build directory');
    }

    try {
      await replace({
        files: path.join(platformDir, 'android', 'build.gradle'),
        from: '//<CLI> buildDir = "C:/tmp/',
        to: `buildDir = "C:/tmp/${appId}/`
      })
    } catch (err) {
      console.log('WARN: Could not set the tmp build directory for android app');
    }
  }
}

export async function getPlatformVersion(appId) {
  const { mobileAppVersion } = await appManager.getApplicationPlatform(appId);

  return mobileAppVersion;
}

export async function downloadApp(appId, destinationDir) {
  analytics.setAppId(appId);

  const mobileAppVersion = await getPlatformVersion(appId);
  await pullPlatform(mobileAppVersion, destinationDir);
}

async function pullPlatform(version, destination) {
  const url = `${cliUrls.mobileAppUrl}/archive/v${version}.tar.gz`;
  await decompressUri(url, destination, { strip: 1 });
}

export async function runPlatform(platformDir, { platform, device, simulator, release }) {
  const runOptions = ['--platform', platform];

  if (device) {
    runOptions.push('--device', device);
  }

  if (simulator) {
    runOptions.push('--simulator', simulator);
  }

  if (release) {
    runOptions.push('--configuration', 'Release');
  }

  return await npm.run(platformDir, 'run', runOptions);
}

export async function runShoutemWatcher(platformDir) {
  const { workingDirectories } = await readJsonFile(path.join(platformDir, 'config.json')) || {};

  if ((workingDirectories || []).length > 0) {
    const watcherPath = path.join(platformDir, 'scripts', 'helpers', 'run-watch-in-new-window.js');
    const runWatchInNewWindow = require(watcherPath);
    runWatchInNewWindow();
  }
}
