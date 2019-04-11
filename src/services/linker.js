import path from 'path';
import _ from 'lodash';
import fs from 'fs-extra';
import cache from './cache';

export function getLinkedDirectories() {
  const allDirectories = cache.getValue('linked-extensions') || [];
  const existingDirectories = allDirectories.filter(fs.existsSync);

  if (!_.isEqual(allDirectories, existingDirectories)) {
    setLinkedDirectories(existingDirectories);
  }

  return existingDirectories;
}

export function setLinkedDirectories(dirs) {
  cache.setValue('linked-extensions', dirs);
}

export function linkExtension(extensionDir) {
  const fullPath = path.resolve(path.join(extensionDir, 'app'));

  if (!fs.existsSync(path.join(fullPath, 'package.json'))) {
    throw new Error('Given path does not contain an extension');
  }

  return linkDirectory(fullPath);
}

export function linkDirectory(dir) {
  const fullPath = path.resolve(dir);

  const dirs = getLinkedDirectories();
  if (dirs.indexOf(fullPath) >= 0) {
    return false;
  }

  dirs.push(fullPath);
  setLinkedDirectories(dirs);

  return true;
}

export function unlinkDirectory(dir) {
  dir = path.resolve(dir);

  const linked = getLinkedDirectories();
  _.pull(linked, dir, path.join(dir, 'app'));

  setLinkedDirectories(linked);
}
