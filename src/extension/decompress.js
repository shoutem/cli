import path from 'path';
import { dir } from 'tmp-promise';
import decompress from 'decompress';
import download from 'download';
import pipeStreams from 'pipe-streams-to-promise';
import fs from 'fs';
import request from 'request';
import progress from 'request-progress';
const cachedRequest = require('cached-request')(request);
import getHomeDir from '../home-dir';

cachedRequest.setCacheDirectory(path.join(getHomeDir(), 'cache', 'cached-requests'));
cachedRequest.setValue('ttl', 1000 * 3600 * 24 * 180);

export default async function(url, destination, options) {
  const tmpPath = path.join((await dir()).path, 'download.tgz');

  let readStream = options.useCache ? cachedRequest({ url }) : request({ url });
  if (options.progress) {
    readStream = progress(readStream);
    readStream.on('progress', options.progress);
    readStream.on('end', () => options.progress(null));
  }

  await pipeStreams([readStream, fs.createWriteStream(tmpPath)]);
  await decompress(tmpPath, destination, options);
}
