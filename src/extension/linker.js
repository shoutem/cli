import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';
import { mobileEnvPath } from '../clients/cli-paths';
import { pathExists, readJsonFile, writeJsonFile } from './data';

async function getLinkedPath() {
  return path.join(await mobileEnvPath(), 'linked-directories.json');
}

export async function getLinkedDirectories() {
  return await readJsonFile(await getLinkedPath()) || [];
}

export async function setLinkedDirectories(dirs) {
  return await writeJsonFile(dirs, await getLinkedPath());
}

export async function linkExtension(extensionDir) {
  const fullPath = path.resolve(path.join(extensionDir, 'app'));

  if (!await pathExists(path.join(fullPath, 'package.json'))) {
    throw new Error('Given path does not contain an extension');
  }

  return await linkDirectory(fullPath);
}

export async function linkDirectory(dir) {
  const fullPath = path.resolve(dir);

  const dirs = await getLinkedDirectories();
  if (dirs.indexOf(fullPath) >= 0) {
    return false;
  }

  dirs.push(fullPath);
  await setLinkedDirectories(dirs);

  return true;
}

export async function unlinkDirectory(dir) {
  await unlinkMissingExtensions();
  dir = path.resolve(dir);

  const linked = await getLinkedDirectories();
  _.pull(linked, [dir, path.join(dir, 'app')]);

  await setLinkedDirectories(linked);
}

async function unlinkMissingExtensions() {
  const dirs = await Promise.filter(await getLinkedDirectories(), pathExists);
  await setLinkedDirectories(dirs);
}
