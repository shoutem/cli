import path from 'path';
import fs from 'fs-extra';
import decompress from 'decompress';
import { execSync } from 'child_process';
import downloadCached from 'download-cached';
import commandExists from 'command-exists';
import extractZip from 'extract-zip';
import request from 'request';
import isGzip from 'is-gzip';
import tar from 'tar';

import { pipeDownloadToFile } from './download';
import getHomeDir from '../home-dir';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests');
const download = downloadCached(cacheDir, downloadCached.requestGet(request));

function extractZipPromise(filePath, options) {
  return new Promise((resolve, reject) => {
    extractZip(filePath, options, (err) => (
      err ? reject(err) : resolve(filePath)
    ));
  });
}

export async function decompressZip(filePath, destination, stripFirstDir = true) {
  let firstDirPath = '';

  // since there is no (apparent) easy way to strip/skip the first
  // directory, we need to save the first directory's name for later,
  // so we can move the extracted files one directory up
  function onZipFileEntry(entry) {
    if (firstDirPath !== '') {
      return;
    }

    firstDirPath = path.resolve(destination, entry.fileName);
  }

  const extractOptions = {
    dir: destination,
    onEntry: onZipFileEntry,
  };

  fs.ensureDirSync(destination);

  try {
    await extractZipPromise(filePath, extractOptions);

    if (stripFirstDir) {
      if (await commandExists('mv')) {
        execSync(`mv ${firstDirPath}/.[!.]* ${destination}`);
        execSync(`mv ${firstDirPath}/* ${destination}`);
        execSync(`rm -rf ${firstDirPath}`);
      } else {
        fs.moveSync(firstDirPath, destination);
      }
    }

    return Promise.resolve(destination);
  } catch (err) {
    return Promise.reject(err);
  }
}

// uses 'node-tar'
export function decompressTarGz(filePath, destination, stripFirstDir = true) {
  fs.ensureDirSync(destination);

  return tar.extract({
    file: filePath,
    cwd: destination,
    strict: false,
    sync: false,
    strip: stripFirstDir ? 1 : 0,
  });
}

export async function decompressTarGzFromUrl(url, destination, options = {}) {
  const fileName = url.split('/').pop();
  const filePath = path.join(destination, fileName);

  try {
    await pipeDownloadToFile(url, destination, options);
    await decompressTarGz(filePath, destination);

    return Promise.resolve(destination);
  } catch (err) {
    return Promise.reject(err);
  }
}

// uses 'extract-zip', which is a wrapper around 'yauzl'
export async function decompressZipFromUrl(url, destination, options = {}) {
  const fileName = url.split('/').pop();
  const filePath = path.join(destination, fileName);

  try {
    await pipeDownloadToFile(url, destination, options);
    await decompressZip(filePath, destination);

    return Promise.resolve(destination);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function decompressFromUrl(url, destination, options = {}) {
  const fileName = options.fileName || url.split('/').pop();
  const filePath = path.join(destination, fileName);

  await pipeDownloadToFile(url, destination, options);

  return decompressFile(filePath, destination, options);
}

export async function decompressFile(filePath, destination, options = {}) {
  const { stripFirstDir = true, deleteArchiveWhenDone = false } = options;

  const fileBuffer = fs.readFileSync(filePath);

  if (isGzip(fileBuffer)) {
    await decompressTarGz(filePath, destination, stripFirstDir);
  } else {
    await decompressZip(filePath, destination, stripFirstDir);
  }

  if (deleteArchiveWhenDone) {
    fs.remove(filePath);
  }

  Promise.resolve(destination);
}

export async function decompressFromUrlLegacy(url, destination, options) {
  if (!options.useCache) {
    await download.clear(url);
  }

  const onData = options.progress || (() => { });

  const tmpPath = await download.toCache(url, { onData });
  await decompress(tmpPath, destination, options);
}
