import path from 'path';
import decompress from 'decompress';
import downloadCached from 'download-cached';
import getHomeDir from '../home-dir';
import request from 'request';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests');
const download = downloadCached(cacheDir, downloadCached.requestGet(request));

async function decompressFromUrlCompat(url, destination, options) {
  if (!options.useCache) {
    await download.clear(url);
  }

  const onData = options.progress || (() => {});

  const tmpPath = await download.toCache(url, { onData });
  await decompress(tmpPath, destination, options);
}

export {
  decompressFromUrlCompat,
}
