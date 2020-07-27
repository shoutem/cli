import _ from 'lodash';
import * as packageManager from './package-manager-service';
import { exec } from 'child-process-promise'

// TODO: Switch to using this from command or from cached CLI settings
// const packageManager = getPackageManager();
const packageManager = 'yarn';

export async function containsBuildTask(dir) {
  try {
    const pkgJson = await packageManager.getPackageJson(dir);
    return !!_.get(pkgJson, 'scripts.build');
  } catch (err) {
    return false;
  }
}

export async function buildNodeProject(dir) {
  if (!await containsBuildTask(dir)) {
    return false;
  }

  try {
    await exec(`${packageManager} install`, { cwd: dir, FORCE_COLOR: true });
    await exec(`${packageManager} run build`, { cwd: dir, FORCE_COLOR: true });
  } catch (err) {
    console.log(err.stdout);
    console.error(err.stderr);
    err.message = `${err.message + '\n'}Build failed for ${dir} directory.`;
    throw err;
  }
  return true;
}
