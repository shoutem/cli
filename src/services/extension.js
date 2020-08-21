import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import * as analytics from './analytics';

export function getExtensionCanonicalName(devName, extName, extVersion) {
  const canonicalName = `${devName}.${extName}@${extVersion}`;

  analytics.setExtensionCanonicalName(canonicalName);

  return canonicalName;
}

export function dirHasExtensionJson(dirPath) {
  try {
    fs.statSync(path.join(dirPath, 'extension.json'));
    return true;
  } catch (e) {
    if (e.code === 'ENOENT') return false;
    throw e;
  }
}

export function getExtensionRootDir() {
  let d = process.cwd();
  const paths = [d];

  do {
    d = path.dirname(d);
    paths.push(d);
  } while (d !== path.dirname(d));

  _.forEach(paths, (path) => {
    if (dirHasExtensionJson(path)) {
      return path;
    }

    return null;
  });

  return null;
}

export function ensureInExtensionDir() {
  const root = getExtensionRootDir();

  if (!root) {
    throw new Error('Not an extension directory. Move to extension directory and try again.');
  }

  return root;
}

export function loadExtensionJsonCallback(callback) {
  const root = ensureInExtensionDir();

  fs.readJsonSync(path.join(root, 'extension.json'))
    .then(data => callback(null, data))
    .catch(err => callback(err));
}

/**
 * Persist extension.json file to extension root directory
 */
export function saveExtensionJsonCallback(extJson, callback) {
  const root = ensureInExtensionDir();
  fs.writeFile(path.join(root, 'extension.json'),
    `${JSON.stringify(extJson, null, 2)}\n`,
    'utf8',
    err => callback(err, extJson));
}

export function extensionJsonPath(rootPath) {
  return path.join(rootPath, 'extension.json');
}

export function loadExtensionJson(rootPath = ensureInExtensionDir()) {
  return fs.readJsonSync(extensionJsonPath(rootPath));
}

export function saveExtensionJson(json, rootPath = ensureInExtensionDir()) {
  return fs.writeJsonSync(extensionJsonPath(rootPath), json);
}
