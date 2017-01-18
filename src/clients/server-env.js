import os from 'os';
import path from 'path';
import fs from 'fs';
import mzfs from 'mz/fs';

const serverEnvNamePath = path.join(os.homedir(), '.shoutem', 'server-env');

export function getHostEnvName() {
  try {
    return fs.readFileSync(serverEnvNamePath, 'utf8');
  } catch (err) {
    return 'production';
  }
}

export async function setHostEnvName(name) {
  await mzfs.writeFile(serverEnvNamePath, name);
}
