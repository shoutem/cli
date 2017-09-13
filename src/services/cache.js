import path from 'path';
import mkdirp from 'mkdirp-promise'
import { readJsonFile, writeJsonFile } from './data';
import { getLocalStoragePath } from '../clients/cli-paths';

async function getCacheFilePath(key) {
  const cacheDir = path.join(await getLocalStoragePath(), 'cache');
  await mkdirp(cacheDir);
  return path.join(cacheDir, encodeURIComponent(typeof key === 'string' ? key : JSON.stringify(key)));
}

export async function getValue(key) {
  const cached = await readJsonFile(await getCacheFilePath(key)) || {};
  if (!cached.expiration || cached.expiration > new Date().getTime()) {
    return cached.value;
  } else {
    return null;
  }
}

export async function setValue(key, value, expirationSeconds) {
  const expiration = expirationSeconds ? new Date().getTime() + expirationSeconds * 1000 : null;

  await writeJsonFile({ expiration, value }, await getCacheFilePath(key));

  return value;
}

export async function get(key, expirationSeconds, func) {
  return await getValue(key) || setValue(key, await func(), expirationSeconds);
}
