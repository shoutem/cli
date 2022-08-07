import fs from 'fs-extra';
import getHomeDir from '../home-dir';

export async function getLocalStoragePath() {
  const storagePath = getHomeDir();

  await fs.mkdir(storagePath, { recursive: true });

  return storagePath;
}

export function getLocalStoragePathSync() {
  const storagePath = getHomeDir();

  fs.mkdirSync(storagePath, { recursive: true });

  return storagePath;
}
