import path from 'path';
import decompress from 'decompress';
import downloadCached from 'download-cached';
import getHomeDir from '../home-dir';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests-bla');
const download = downloadCached(cacheDir, downloadCached.fetchGet(fetch));

const cacheDirCompat = path.join(getHomeDir(), 'cache', 'cached-requests-compat');
const downloadCompat = downloadCached(cacheDirCompat);

async function decompressFromUrl(url, destination, options) {
  if (!options.useCache) {
    await download.clear(url);
  }

  const onData = options.progress || (() => {});

  const tmpPath = await download.toCache(url, { onData });
  await decompress(tmpPath, destination, options);
}

// for an as yet undetermined reason, downloadCached.fetchGet fails
// to fetch some s3 downloads, while this method also fails
// to fetch some others... This has lead to creation of two
// decompress methods. To be refactored along with our
// unification of all download/archive/unpack methods into one service.
async function decompressFromUrlCompat(url, destination, options) {
  try {
    if (!options.useCache) {
      await downloadCompat.clear(url);
    }

    const onData = options.progress || (() => {});

    const tmpPath = await downloadCompat.toCache(url, { onData });
    await decompress(tmpPath, destination, options);
  } catch (err) {
    return decompressFromUrl(url, destination, options);
  }
}

export {
  decompressFromUrl,
  decompressFromUrlCompat,
};
