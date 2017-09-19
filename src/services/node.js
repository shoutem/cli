import _ from 'lodash';
import * as npm from "./npm";

export async function containsBuildTask(dir) {
  try {
    const pkgJson = await npm.getPackageJson(dir);
    return !!_.get(pkgJson, 'scripts.build');
  } catch (err) {
    return false;
  }
}

export class BuildError {
  /*
   Used when bad username or password is supplied.
   */
  constructor(message) {
    this.message = message;
  }
}

export async function buildNodeProject(dir) {
  if (!await containsBuildTask(dir)) {
    return false;
  }

  try {
    await npm.install(dir);
    await npm.run(dir, 'build');
  } catch (err) {
    throw new BuildError(`${err.message || err}\nBuild failed for ${dir} directory.`);
  }

  return true;
}

