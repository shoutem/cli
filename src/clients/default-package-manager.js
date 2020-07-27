import path from 'path';
import fs from 'fs-extra';
import { getLocalStoragePathSync } from '../clients/cli-paths';

const defaultPackageManagerFilePath = path.join(
  getLocalStoragePathSync(),
  'default-package-manager'
);

export function getDefaultPackageManager() {
  try {
    return fs.readFileSync(defaultPackageManagerFilePath, 'utf8');
  } catch (err) {
    // an error is only likely to appear if the file doesn't exist
    console.log("Error reading default package manager. Setting it to 'npm'.");
    setDefaultPackageManager('npm');
    return 'npm';
  }
}

export function setDefaultPackageManager(name) {
  fs.writeFileSync(defaultPackageManagerFilePath, name);
}
