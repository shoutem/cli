import _ from 'lodash';
import * as npm from "./npm";
import { exec } from 'child-process-promise'

export async function containsBuildTask(dir) {
  try {
    const pkgJson = await npm.getPackageJson(dir);
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
    await exec('npm install', { cwd: dir, FORCE_COLOR: true });
    await exec('npm run build', { cwd: dir, FORCE_COLOR: true });
  } catch (err) {
    console.log(err.stdout);
    console.error(err.stderr);
    err.message = `${err.message + '\n'}Build failed for ${dir} directory.`;
    throw err;
  }
  return true;
}
