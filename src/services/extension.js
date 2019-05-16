import fs from 'fs';
import path from 'path';

import { readJsonFile, writeJsonFile } from './data';
import analytics from './analytics';

export function getExtensionCanonicalName(devName, extName, extVersion) {
  const canonicalName = `${devName}.${extName}-${extVersion}`;

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

  for (const p of paths) {
    if (dirHasExtensionJson(p)) return p;
  }

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
  try {
    const extJson = loadExtensionJson();
    callback(null, extJson);
  } catch (err) {
    callback(err, extJson);
  }
}

/**
 * Persist extension.json file to extension root directory
 */
export function saveExtensionJsonCallback(extJson, callback) {
  try{
    saveExtensionJson(extJson);
    callback(null, extJson);
  } catch (err) {
    callback(err, extJson);
  }
}

export function extensionJsonPath(rootPath = ensureInExtensionDir()) {
  return path.join(rootPath, 'extension.json');
}

export function loadExtensionJson(rootPath = ensureInExtensionDir()) {
  return readJsonFile(extensionJsonPath(rootPath));
}

export function saveExtensionJson(json, rootPath = ensureInExtensionDir()) {
  return writeJsonFile(extensionJsonPath(rootPath), json);
}
