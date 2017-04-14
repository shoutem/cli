import path from 'path';
import bluebird from 'bluebird';
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

  const i1 = linked.indexOf(dir);
  if (i1 >= 0) {
    linked.splice(i1, 1);
  }

  const i2 = linked.indexOf(path.join(dir, 'app'));
  if (i2 >= 0) {
    linked.splice(i2, 1);
  }

  await setLinkedDirectories(linked);

  return i1 >= 0 || i2 >= 0;
}

async function unlinkMissingExtensions() {
  const dirs = await bluebird.filter(await getLinkedDirectories(), pathExists);
  await setLinkedDirectories(dirs);
}
