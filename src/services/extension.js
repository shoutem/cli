import fs from 'fs';
import path from 'path';
import * as analytics from './analytics';
import { readJsonFile, writeJsonFile } from './data';

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

  for (const p of paths) {
    if (dirHasExtensionJson(p)) return p;
  }

  return null;
}

export function ensureInExtensionDir() {
  const root = getExtensionRootDir();

  if (!root) {
    throw new Error(
      'Not an extension directory. Move to extension directory and try again.',
    );
  }

  return root;
}

export function loadExtensionJsonCallback(callback) {
  const root = ensureInExtensionDir();

  readJsonFile(path.join(root, 'extension.json'))
    .then(data => callback(null, data))
    .catch(err => callback(err));
}

/**
 * Persist extension.json file to extension root directory
 */
export function saveExtensionJsonCallback(extJson, callback) {
  const root = ensureInExtensionDir();
  fs.writeFile(
    path.join(root, 'extension.json'),
    `${JSON.stringify(extJson, null, 2)}\n`,
    'utf8',
    err => callback(err, extJson),
  );
}

export function extensionJsonPath(rootPath) {
  return path.join(rootPath, 'extension.json');
}

export async function loadExtensionJson(rootPath = ensureInExtensionDir()) {
  return await readJsonFile(extensionJsonPath(rootPath));
}

export async function saveExtensionJson(
  json,
  rootPath = ensureInExtensionDir(),
) {
  return await writeJsonFile(json, extensionJsonPath(rootPath));
}
