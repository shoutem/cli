// Code originally written by Ivo Katunaric -> https://github.com/ikatun/download-cached

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { v1: uuid } = require('uuid');
const { mkdirp } = require('mkdirp');

function getCachedFilePath(cacheDirectory, url) {
  const urlHash = crypto.createHash('md5').update(url).digest('hex');
  return path.join(cacheDirectory, urlHash);
}

function asPromise(f, ...args) {
  return new Promise((resolve, reject) => {
    f(...args, (err, ...res) => err ? reject(err) : resolve(res.length < 2 ? res[0] : res));
  });
}

function promiseEvent(emitter, event) {
  return new Promise((resolve, reject) => {
    emitter.on(event, res => resolve(emitter));
    emitter.on('error', err => reject(err));
  });
}

function httpGet(url) {
  const client = typeof url === 'string' && url.startsWith('https') ? require('https') : require('http');
  return new Promise((resolve, reject) => {
      client.get(url, res => {
        if (res.statusCode !== 200) {
          reject(new Error('Response status code is ' + res.statusCode));
        } else {
          res.contentLength = parseInt(res.headers['content-length']) || null;
          resolve(res);
        }
      }).on('error', err => reject(err));
    });
}

const fetchGet = fetch => url => fetch(url)
  .then(res => {
    if (res.status === 200) {
      res.body.contentLength = parseInt(res.headers.get('content-length')) || null;
      return res.body;
    } else {
      return Promise.reject(new Error('Response status code is ' + res.status));
    }
  });

const requestGet = request => url => new Promise((resolve, reject) => {
  const req = request(url);
  req.on('response', res => {
    if (res.statusCode !== 200) {
      reject(new Error('Response status code is ' + res.statusCode));
    } else {
      res.contentLength = parseInt(res.headers['content-length']) || null;
      res.pause();
      resolve(res);
    }
  })
  .on('error', err => reject(err));
});

function writeStreamToFile(srcStream, destPath) {
  const destStream = fs.createWriteStream(destPath);
  srcStream.pipe(destStream);
  return promiseEvent(destStream, 'close');
}

function openFsReadStreamWithSize(path) {
  return Promise.all([
    asPromise(fs.stat, path),
    promiseEvent(fs.createReadStream(path), 'open')
  ]).then(([stats, readStream]) => {
    readStream.contentLength = stats.size;
    return readStream;
  })
}

function attachOnDataEvent(stream, onData) {
  if (onData) {
    stream.on('data', data => {
      data.total = stream.contentLength;
      onData(data);
    });
    stream.on('end', () => onData(null));
  }
  return stream;
}

module.exports = (cacheDirectory, urlToStreamPromise = httpGet) => {
  const pendingCacheDirectory = path.join(cacheDirectory, 'pending');

  const download = (url, opts) => mkdirp(pendingCacheDirectory).then(() => {
    opts = opts || {};
    const cachedFilePath = getCachedFilePath(cacheDirectory, url);
    // if file is already cached, return stream from cache
    if (opts.returnCachedPath) {
      return asPromise(fs.stat, cachedFilePath).then(() => cachedFilePath);
    } else {
      return openFsReadStreamWithSize(cachedFilePath).then(stream => attachOnDataEvent(stream, opts.onData));
    }
  }).catch(err => {
    if (err.code !== 'ENOENT') {
      return Promise.reject(err);
    }
    return urlToStreamPromise(url);
  }).then(networkStream => {
    if (typeof networkStream === 'string') {
      return networkStream;
    }
    // file is not cached, start downloading into a pending directory
    const pendingFilePath = path.join(pendingCacheDirectory, uuid());
    const pendingWriteStream = fs.createWriteStream(pendingFilePath);
    networkStream.pipe(pendingWriteStream);
    attachOnDataEvent(networkStream, opts.onData);
    pendingWriteStream.on('error', () => {
      fs.unlink(pendingFilePath, () => {});
    });
    const cachedFilePath = getCachedFilePath(cacheDirectory, url);
    if (opts.returnCachedPath) {
      return promiseEvent(pendingWriteStream, 'close')
        .then(() => asPromise(fs.rename, pendingFilePath, cachedFilePath))
        .then(() => cachedFilePath);
    } else {
      pendingWriteStream.on('close', () => {
        // file downloaded, move it from the pending directory to the cache directory
        fs.rename(pendingFilePath, cachedFilePath);
      });
      return networkStream;
    }
  });

  download.clear = url => {
    const filePath = getCachedFilePath(cacheDirectory, url);
    return asPromise(fs.unlink, filePath).catch(err => err.code === 'ENOENT' ? Promise.resolve() : Promise.reject(err));
  };

  download.toFile = (url, destPath, opts) => download(url, opts).then(stream => writeStreamToFile(stream, destPath));
  download.toCache = (url, opts) => {
    opts = opts || {};
    opts.returnCachedPath = true;
    return download(url, opts);
  }

  return download;
}

module.exports.httpGet = httpGet;
module.exports.requestGet = requestGet;
module.exports.fetchGet = fetchGet;