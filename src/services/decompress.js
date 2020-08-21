import path from 'path';
import decompress from 'decompress';
import downloadCached from 'download-cached';
import getHomeDir from '../home-dir';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests');
// don't ask me how it works, CLIvo magic
// eslint-disable-next-line
const download = downloadCached(cacheDir, downloadCached.fetchGet(fetch));

export default async function (url, destination, options) {
  if (!options.useCache) {
    await download.clear(url);
  }

  const onData = options.progress || (() => {});

  const tmpPath = await download.toCache(url, { onData });
  await decompress(tmpPath, destination, options);
}
