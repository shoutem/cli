import path from 'path';
import mkdirp from 'mkdirp-promise'
import { readJsonFile, writeJsonFile } from '../extension/data';
import { localStoragePath } from '../clients/cli-paths';

async function getCacheFilePath(key) {
  const cacheDir = path.join(await localStoragePath(), 'cache');
  await mkdirp(cacheDir);
  return path.join(cacheDir, encodeURIComponent(typeof key === 'string' ? key : JSON.stringify(key)));
}

async function getValue(key) {
  const cached = await readJsonFile(await getCacheFilePath(key)) || {};
  if (cached.expiration > new Date().getTime()) {
    return cached.value;
  } else {
    return null;
  }
}

async function setValue(key, value, expirationSeconds) {
  await writeJsonFile({
    expiration: new Date().getTime() + expirationSeconds * 1000,
    value
  }, await getCacheFilePath(key));

  return value;
}

export async function get(key, expirationSeconds, func) {
  return await getValue(key) || setValue(key, await func(), expirationSeconds);
}
