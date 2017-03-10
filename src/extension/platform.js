import path from 'path';
import { readJsonFile } from './data';

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
