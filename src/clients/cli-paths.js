import path from 'path';
import mkdirp from 'mkdirp-promise';
import { sync as mkdirpSync } from 'mkdirp';
import { getHostEnvName } from './server-env';
import getHomeDir from '../home-dir';

export async function localStoragePath() {
  const storagePath = getHomeDir();
  await mkdirp(storagePath);
  return storagePath;
}

export function localStoragePathSync() {
  const storagePath = getHomeDir();
  mkdirpSync(storagePath);
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
