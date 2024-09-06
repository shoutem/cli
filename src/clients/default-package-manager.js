import path from 'path';
import fs from 'fs-extra';
import { getLocalStoragePathSync } from '../clients/cli-paths';

const defaultPackageManagerFilePath = path.join(
  getLocalStoragePathSync(),
  'default-package-manager',
);

export function setDefaultPackageManager(name) {
  fs.writeFileSync(defaultPackageManagerFilePath, name);
}

export function getDefaultPackageManager() {
  try {
    // Disable bun in favour of npm for the time being
    const resolvedManager = fs.readFileSync(
      defaultPackageManagerFilePath,
      'utf8',
    );
    return resolvedManager;
  } catch (err) {
    setDefaultPackageManager('npm');
    return 'npm';
  }
}
