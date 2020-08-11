import _ from 'lodash';
import {
  packageManager as defaultPackageManager
} from './package-manager-service';
import * as packageManager from './package-manager-service';
import { exec } from 'child-process-promise'

export async function containsBuildTask(dir) {
  try {
    const packageJson = await packageManager.getPackageJson(dir);
    return !!_.get(packageJson, 'scripts.build');
  } catch (err) {
    return false;
  }
}

export async function buildNodeProject(dir) {
  if (!await containsBuildTask(dir)) {
    return false;
  }

  try {
    await exec(`${defaultPackageManager} install`, { cwd: dir, FORCE_COLOR: true });
    await exec(`${defaultPackageManager} run build`, { cwd: dir, FORCE_COLOR: true });
  } catch (err) {
    console.log(err.stdout);
    console.error(err.stderr);
    err.message = `${err.message + '\n'}Build failed for ${dir} directory.`;
    throw err;
  }
  return true;
}
