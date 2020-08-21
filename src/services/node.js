import { exec } from 'child-process-promise';
import _ from 'lodash';
import { packageManager, getPackageJson } from './package-manager-service';

export async function containsBuildTask(dir) {
  try {
    const packageJson = getPackageJson(dir);
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
    await exec(`${packageManager} install`, { cwd: dir, FORCE_COLOR: true });
    await exec(`${packageManager} run build`, { cwd: dir, FORCE_COLOR: true });
  } catch (err) {
    console.log(err.stdout);
    console.error(err.stderr);
    err.message = `${err.message}\nBuild failed for ${dir} directory.`;
    throw err;
  }
  return true;
}
