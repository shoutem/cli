import path from 'path';
import mkdirp from 'mkdirp-promise';
import { sync as mkdirpSync } from 'mkdirp';
import { getHostEnvName } from './server-env';
import getHomeDir from '../home-dir';

export async function getLocalStoragePath() {
  const storagePath = getHomeDir();
  await mkdirp(storagePath);
  return storagePath;
}

export function getLocalStoragePathSync() {
  const storagePath = getHomeDir();
  mkdirpSync(storagePath);
  return storagePath;
}

export async function mobileEnvPath() {
  const hostEnvName = getHostEnvName();
  const envPath = path.join(await getLocalStoragePath(), hostEnvName, 'client');
  await mkdirp(envPath);
  return envPath;
}
