import { readJsonFile } from './data';
import path from 'path';
import * as yarn from './/yarn'

export async function containsBuildTask(dir) {
  const pkgJson = await readJsonFile(path.join(dir, 'package.json'));

  return pkgJson && pkgJson.scripts && pkgJson.scripts.build;
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
    await yarn.install(dir);
    await yarn.run(dir, 'build');
  } catch (err) {
    throw new BuildError(`${err.message || err}\nBuild failed for ${dir} directory.`);
  }

  return true;
}
