import path from 'path';
import fs from 'fs-extra'
import { readJsonFile, writeJsonFile } from './data';
import { getLocalStoragePath } from '../clients/cli-paths';

function getCacheFilePath(_key) {
  const cacheDir = path.join(getLocalStoragePath(), 'cache');
  const key = (typeof _key === 'string') ? _key : JSON.stringify(_key);

  fs.ensureDirSync(cacheDir);

  return path.join(cacheDir, encodeURIComponent(key));
}

export function getValue(key) {
  const cached = readJsonFile(getCacheFilePath(key)) || {};

  if (!cached.expiration || cached.expiration > new Date().getTime()) {
    return cached.value;
  }

  return null;
}

export function setValue(key, value, expirationSeconds) {
  const expiration = expirationSeconds ? (new Date().getTime() + (expirationSeconds * 1000)) : null;
  const filePath = getCacheFilePath(key)

  writeJsonFile(filePath, { expiration, value });

  return value;
}

export async function get(key, expirationSeconds, func) {
  return getValue(key) || setValue(key, await func(), expirationSeconds);
}
