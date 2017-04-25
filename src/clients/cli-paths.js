import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import { getHostEnvName } from './server-env';

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

export async function mobileAppConfigPath() {
  return path.join(await mobileAppPath(), 'build-config.json');
}
