import path from 'path';
import decompress from 'decompress';
import downloadCached from 'download-cached';
import tar from 'tar';
import fs from 'fs-extra';
import request from 'request';
import extractZip from 'extract-zip';

import getHomeDir from '../home-dir';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests');
const download = downloadCached(cacheDir, downloadCached.requestGet(request));

const defaultHandlers = {
  onResponse: (response) => {
    if (response.statusCode !== 200) {
      throw new Error(`Invalid status code; ${response.statusCode}`);
    }
  },
  onError: (err) => {
    throw (err);
  },
  onEnd: () => { },
  destinations: [],
};

function pipeDownload(url, handlers = {}, options = {}) {
  const {
    onError,
    onEnd,
    onResponse,
    destinations,
  } = { ...defaultHandlers, ...handlers };

  const progressHandler = options.progress || (() => { });

  let req = request(url)
    .on('error', onError)
    .on('response', onResponse)
    .on('data', progressHandler)
    .on('end', () => {
      progressHandler();
      onEnd();
    });

  destinations.forEach(destination => {
    req = req.pipe(destination);
  });

  return req;
}

function pipeDownloadPromise(url, destinations, options) {
  return new Promise((resolve, reject) => {
    const handlers = {
      onError: reject,
      onEnd: resolve,
      destinations,
    };

    pipeDownload(url, handlers, options);
  });
}

function pipeDownloadToFile(url, destinationDir, options = {}) {
  const fileName = url.split('/').pop();
  const filePath = path.join(destinationDir, fileName);
  const fileStream = fs.createWriteStream(filePath);
  
  return pipeDownloadPromise(url, [fileStream], options);
}

// uses 'node-tar'
function decompressTarGzFromUrl(url, destination, options = {}) {
  const extractor = tar.extract({
    cwd: destination,
    strict: true,
    strip: 1,
  });

  return pipeDownloadPromise(url, [extractor], options);
}

// uses 'extract-zip', which is a wrapper around 'yauzl'
function decompressZipFromUrl(url, destination, options = {}) {
  const fileName = url.split('/').pop();
  const filePath = path.join(destination, fileName);
  let firstDirPath = '';

  // since there is no (apparent) easy way to strip/skip the first
  // directory, we need to save the first directory's
  // name for later, so we can move files one directory up
  function onZipFileEntry(entry) {
    if (firstDirPath !== '') {
      return;
    }

    firstDirPath = path.resolve(destination, entry.fileName);
  }

  return new Promise((resolve, reject) => {
    pipeDownloadToFile(url, destination, options)
      .then(() => {
        const extractOptions = {
          dir: destination,
          onEntry: onZipFileEntry,
        };

        extractZip(filePath, extractOptions, (err) => {
          if (err) {
            reject(err);
            return;
          }

          fs.moveSync(firstDirPath, destination);
          fs.removeSync(firstDirPath);

          resolve();
        });
      });
  });
}

function decompressFromUrl(url, destination, options = {}) {
  const fileName = url.split('/').pop();

  if (fileName.match(/\.tar\.gz$/)) {
    return decompressTarGzFromUrl(url, destination, options);
  }

  if (fileName.match(/\.zip$/)) {
    return decompressZipFromUrl(url, destination, options);
  }

  throw new Error('Only zip and tar.gz files are supported');
}

async function decompressFromUrlLegacy(url, destination, options) {
  if (!options.useCache) {
    await download.clear(url);
  }

  const onData = options.progress || (() => { });

  const tmpPath = await download.toCache(url, { onData });
  await decompress(tmpPath, destination, options);
}

export {
  decompressFromUrlLegacy,
  decompressFromUrl,
};
