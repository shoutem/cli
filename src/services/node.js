import _ from 'lodash';
import { exec } from 'child-process-promise'

import npm from "./npm";

export function containsBuildTask(dir) {
  try {
    const pkgJson = npm.getPackageJson(dir);
    return !!_.get(pkgJson, 'scripts.build');
  } catch (err) {
    return false;
  }
}

export async function buildNodeProject(dir) {
  if (!containsBuildTask(dir)) {
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
