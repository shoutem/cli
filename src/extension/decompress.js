import path from 'path';
import { dir } from 'tmp-promise';
import decompress from 'decompress';
import download from 'download';
import pipeStreams from 'pipe-streams-to-promise';
import fs from 'fs';
import request from 'request';


export default async function(uri, destination, options) {
  const tmpPath = path.join((await dir()).path, 'download.tgz');

  await pipeStreams([request(uri), fs.createWriteStream(tmpPath)]);
  await decompress(tmpPath, destination, options);
}
