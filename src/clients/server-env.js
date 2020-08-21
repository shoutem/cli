import path from 'path';
import fs from 'fs-extra';
import { getLocalStoragePathSync } from './cli-paths';

const serverEnvNamePath = path.join(getLocalStoragePathSync(), 'server-env');

export function getHostEnvName() {
  try {
    return fs.readFileSync(serverEnvNamePath, 'utf8');
  } catch (err) {
    return 'production';
  }
}

export function setHostEnvName(name) {
  fs.writeFileSync(serverEnvNamePath, name);
}
