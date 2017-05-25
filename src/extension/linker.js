import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';
import { pathExists } from 'fs-extra';
import * as cache from './cache';

export async function getLinkedDirectories() {
  const allDirectories = await cache.getValue('linked-extensions') || [];
  const existingDirectories = await Promise.filter(allDirectories, pathExists);

  if (!_.isEqual(allDirectories, existingDirectories)) {
    await setLinkedDirectories(existingDirectories);
  }

  return existingDirectories;
}

export async function setLinkedDirectories(dirs) {
  await cache.setValue('linked-extensions', dirs);
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
  dir = path.resolve(dir);

  const linked = await getLinkedDirectories();
  _.pull(linked, dir, path.join(dir, 'app'));

  await setLinkedDirectories(linked);
}
