import url from 'url';
import path from 'path';
import fs from 'mz/fs';
import glob from 'glob-promise';
import replace from 'replace-in-file';
import { getLinkedDirectories } from './linker';
import { AppManagerClient } from '../clients/app-manager';
import decompressUri from '../extension/decompress';
import apiUrls from '../../config/services';
import cliUrls from '../../config/services';
import { writeJsonFile } from '../extension/data';
import * as npm from '../extension/npm';
import { readJsonFile } from './data';
import { ensureUserIsLoggedIn } from '../commands/login';
import { ensureYarnInstalled } from '../extension/yarn';
import { ensureNodeVersion } from '../extension/node';
import * as reactNative from '../extension/react-native';

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
  const paths = await glob(path.join(platformDir, 'extensions', '*', 'app'));
  return paths;
}

export async function uncommentBuildDir(buildDirectory) {
  const buildGradlePath = path.join(buildDirectory, 'android', 'build.gradle');
  let buildGradle = await fs.readFile(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace('//<CLI> buildDir', 'buildDir');
  await fs.writeFile(buildGradlePath, buildGradle);
}

export async function createMobileConfig(platformDir, { platform, appId, debug = true, excludePackages = ['shoutem.code-push'], production = false, linkLocalExtensions = false, skipNativeDependencies = false, offlineMode = false }) {
  return {
    platform,
    appId: appId.toString(),
    serverApiEndpoint: url.parse(cliUrls.appManager).hostname,
    legacyApiEndpoint: url.parse(cliUrls.legacyService).hostname,
    authorization: await ensureUserIsLoggedIn(),
    configurationFilePath: 'config.json',
    workingDirectories: linkLocalExtensions ? await getExtensionsPaths(platformDir) : await getLinkedDirectories(),
    excludePackages,
    debug,
    extensionsJsPath: "./extensions.js",
    production,
    skipNativeDependencies,
    offlineMode
  };
}

export async function preparePlatform(platformDir, mobileConfig) {
  await ensureYarnInstalled();
  await ensureNodeVersion();
  await reactNative.ensureInstalled();

  const configPath = path.join(platformDir, 'config.json');

  await writeJsonFile(mobileConfig, configPath);
  await npm.install(path.join(platformDir, 'scripts'));
  await npm.run(platformDir, 'configure'/* , ['--configPath', configPath] */);

  // android run script requires android binaries to be stored near the system's root
  if (process.platform === 'win32') {
    await uncommentBuildDir(platformDir);
  }
}

export async function buildPlatform(platformDir, platform, outputDir = process.cwd()) {
  await npm.run(platformDir, 'build', [
    '--platform', platform,
    '--outputDirectory', outputDir
  ]);
}

export async function fixPlatform(platformDir) {
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

    await uncommentBuildDir(platformDir);
  }
}

export async function getPlatformVersion(appId) {
  const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
  const { mobileAppVersion } = await appManager.getApplicationPlatform();

  return mobileAppVersion;
}

export async function downloadApp(appId, destinationDir) {
  const mobileAppVersion = await getPlatformVersion(appId);

  await pullPlatform(mobileAppVersion, destinationDir);
}

async function pullPlatform(version, destination) {
  const url = `${apiUrls.mobileAppUrl}/archive/v${version}.tar.gz`;
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
