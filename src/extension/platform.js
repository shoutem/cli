import path from 'path';
import url from 'url';
import cliUrls from '../../config/services';
import fs from 'mz/fs';
import { writeJsonFile } from '../extension/data';
import * as npm from '../extension/npm';
import { readJsonFile } from './data';
import glob from 'glob-promise';
import { ensureUserIsLoggedIn } from '../commands/login';

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
  console.log(paths);
  return paths;
}

export async function uncommentBuildDir(buildDirectory) {
  const buildGradlePath = path.join(buildDirectory, 'android', 'build.gradle');
  let buildGradle = await fs.readFile(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace('//<CLI> buildDir', 'buildDir');
  await fs.writeFile(buildGradlePath, buildGradle);
}

export async function preparePlatform(platformDir, { platform, appId, release}) {
  const mobileConfig = {
    platform,
    appId,
    serverApiEndpoint: url.parse(cliUrls.appManager).hostname,
    legacyApiEndpoint: url.parse(cliUrls.legacyService).hostname,
    authorization: await ensureUserIsLoggedIn(),
    configurationFilePath: 'config.json',
    /*platformsDirectory: await getPlatformsPath(),*/
    workingDirectories: await getExtensionsPaths(platformDir),
    excludePackages: ['shoutem.code-push'],
    debug: !release,
    offlineMode: true,
    extensionsJsPath: "./extensions.js"
  };

  const configPath = path.join(platformDir, 'config.json');
  console.log(configPath);

  await writeJsonFile(mobileConfig, configPath);
  await npm.install(path.join(platformDir, 'scripts'));
  await npm.run(platformDir, 'configure', ['--configPath', configPath]);

  // android run script requires android binaries to be stored near the system's root
  if (process.platform === 'win32') {
    await uncommentBuildDir(platformDir);
  }
}
