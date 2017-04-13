import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import findNodeModules from 'find-node-modules';
import { getHostEnvName } from './server-env';

const cliRoot = findNodeModules({ relative: false })[0];

export async function localStoragePath() {
  const storagePath = path.join(os.homedir(), '.shoutem');
  await mkdirp(storagePath);
  return storagePath;
}

export async function lastErrorPath() {
  return path.join(await localStoragePath(), 'last-error.json');
}

export async function mobileEnvPath() {
  const hostEnvName = getHostEnvName();
  const envPath = path.join(await localStoragePath(), hostEnvName, 'client');
  await mkdirp(envPath);
  return envPath;
}

export async function serverEnvPath() {
  const hostEnvName = getHostEnvName();
  const envPath = path.join(await localStoragePath(), hostEnvName, 'server');
  await mkdirp(envPath);

  return envPath;
}

export async function mobileAppPath() {
  return mobileEnvPath();
}

export async function mobileAppPackageJson() {
  return path.join(await mobileAppPath(), 'package.json');
}

export async function getPlatformsPath() {
  const platformsPath = path.join(await localStoragePath(), 'platforms');
  await mkdirp(platformsPath);
  return platformsPath;
}

export async function getBuildPath() {
  return await path.join(await getPlatformsPath(), 'build');
}

export function getPlatformBuildPath() {
  return path.join(getCliRoot(), '@shoutem', 'platform-build');
}

export async function getPlatformConfigPath() {
  return path.join(await getPlatformsPath(), 'runtime-configuration.json');
}

export async function mobileAppConfigPath() {
  return path.join(await mobileAppPath(), 'build-config.json');
}

export function getCliRoot() {
  return cliRoot;
}