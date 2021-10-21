import url from 'url';
import path from 'path';
import fs from 'fs-extra';
import request from 'request';
import Promise from 'bluebird';

import { getHttpErrorMessage } from './get-http-error-message';

const downloadFile = Promise.promisify(require('download-file'));

export function getRedirectLocation(uri) {
  return new Promise((resolve, reject) => {
    const protocol = url.parse(uri).protocol.slice(0, -1);
    require(protocol)
      .get(uri, response => {
        resolve(response.headers.location);
      })
      .on('error', err => reject(err));
  });
}

export async function downloadFileFollowRedirect(uri, options) {
  let redirectLocation = null;

  try {
    await downloadFile(uri, options);
  } catch (err) {
    if (err.message.includes('301') || err.message.includes('302')) {
      redirectLocation = await getRedirectLocation(uri);
    } else {
      const errorMessage = getHttpErrorMessage(err.message);
      err.message = `Could not fetch platform\nRequested URL: ${uri}\n${errorMessage}`;
      throw err;
    }

    if (redirectLocation) {
      await downloadFileFollowRedirect(redirectLocation, options);
    }
  }
}

const defaultRequestHandlers = {
  onResponse: response => {
    if (response.statusCode !== 200) {
      throw new Error(`Invalid status code; ${response.statusCode}`);
    }
  },
  onError: err => {
    throw err;
  },
  onEnd: () => {},
  destinations: [],
};

export function pipeDownload(url, handlers = {}, options = {}) {
  const { onError, onEnd, onResponse, destinations } = {
    ...defaultRequestHandlers,
    ...handlers,
  };

  const progressHandler = options.progress || (() => {});

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

export function pipeDownloadPromise(url, destinations, options) {
  return new Promise((resolve, reject) => {
    const handlers = {
      onError: reject,
      onEnd: resolve,
      destinations,
    };

    pipeDownload(url, handlers, options);
  });
}

export function pipeDownloadToFile(url, destinationDir, options = {}) {
  const fileName = options.fileName || url.split('/').pop();
  const filePath = path.join(destinationDir, fileName);

  fs.ensureFileSync(filePath);

  const fileStream = fs.createWriteStream(filePath);

  pipeDownloadPromise(url, [fileStream], options);

  return new Promise((resolve, reject) => {
    fileStream.on('error', reject);
    fileStream.on('close', resolve);
  });
}
