import fs from 'fs';
import path from 'path';
import mzfs from 'mz/fs';
import * as analytics from './analytics';
import Promise from 'bluebird';

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

export function readJsonFile(filePath) {
  return mzfs
    .readFile(filePath, 'utf8')
    .catch(err => err.code === 'ENOENT' ? null : Promise.reject(err))
    .then(content => JSON.parse(content));
}

export function writeJsonFile(json, filePath) {
  const str = `${JSON.stringify(json, null, 2)}\n`;
  return mzfs
    .writeFile(filePath, str, 'utf8')
    .then(() => str);
}

export function exit(err) {
  console.log(err.message);
  process.exit(1);
}

export function ensureInExtensionDir() {
  const msg = 'Not an extension directory.';
  let root;

  try {
    root = getExtensionRootDir();
  } catch (exc) {
    exit(exc);
  }

  if (!root) exit(new Error(msg));
  return root;
}


export function loadExtensionJson(callback) {
  const root = ensureInExtensionDir();

  readJsonFile(path.join(root, 'extension.json'))
    .then(data => callback(null, data))
    .catch(err => callback(err));
}

export async function loadExtensionJsonAsync(rootPath = ensureInExtensionDir()) {
  return await readJsonFile(path.join(rootPath, 'extension.json'));
}

export function saveExtensionJson(extJson, callback) {
  const root = ensureInExtensionDir();
  fs.writeFile(path.join(root, 'extension.json'),
               `${JSON.stringify(extJson, null, 2)}\n`,
               'utf8',
               err => callback(err, extJson));
}

export const saveExtensionJsonAsync = Promise.promisify(saveExtensionJson);

export async function pathExists(path) {
  try {
    await mzfs.stat(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
      return false;
    }
    throw err;
  }
}
