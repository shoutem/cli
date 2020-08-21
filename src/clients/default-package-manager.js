import path from 'path';
import fs from 'fs-extra';

import { getLocalStoragePathSync } from './cli-paths';

const defaultPackageManagerFilePath = path.join(
  getLocalStoragePathSync(),
  'default-package-manager',
);

export function setDefaultPackageManager(name) {
  fs.writeFileSync(defaultPackageManagerFilePath, name);
}

export function getDefaultPackageManager() {
  try {
    return fs.readFileSync(defaultPackageManagerFilePath, 'utf8');
  } catch (err) {
    setDefaultPackageManager('npm');
    return 'npm';
  }
}
