import path from 'path';
import { dir } from 'tmp-promise';
import decompress from 'decompress';
import pipeStreams from 'pipe-streams-to-promise';
import fs from 'fs';
import request from 'request';
import progress from 'request-progress';
import downloadCached from 'download-cached';
import getHomeDir from '../home-dir';

const cacheDir = path.join(getHomeDir(), 'cache', 'cached-requests');
const download = downloadCached(cacheDir, downloadCached.fetchGet);

export default async function(url, destination, options) {
  const tmpPath = path.join((await dir()).path, 'download.tgz');

  if (!options.useCache) {
    await download.clear(url);
  }
  await download(url).toFile(tmpPath);
/*
  if (options.progress) {
    readStream = progress(readStream);
    readStream.on('progress', options.progress);
    readStream.on('end', () => options.progress(null));
  }*/
  await decompress(tmpPath, destination, options);
}
