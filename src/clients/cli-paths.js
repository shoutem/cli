import mkdirp from 'mkdirp-promise';
import { sync as mkdirpSync } from 'mkdirp';
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
