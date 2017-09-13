import path from 'path';
import Promise from 'bluebird';
import { readJson } from 'fs-extra';
import { spawn } from 'child-process-promise';
import {writeJsonFile} from "./data";
const linkLocal = Promise.promisify(require('linklocal'));

export async function install(cwd = process.cwd()) {
  await spawn('npm', ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true }
  });
}

export async function run(cwd, task, taskArgs = [], npmOptions = []) {
  const opts = {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
  };

  const spawned = taskArgs.length ?
    spawn('npm', ['run', task, ...npmOptions, '--', ...taskArgs], opts) :
    spawn('npm', ['run', task, ...npmOptions], opts);

  return await spawned;
}

export async function getPackageJson(npmProjectPath) {
  return await readJson(path.join(npmProjectPath, 'package.json'));
}

export async function savePackageJson(npmProjectPath, pkgJson) {
  return await writeJsonFile(pkgJson, path.join(npmProjectPath, 'package.json'));
}

export async function addLocalDependency(npmProjectPath, npmModulePath) {
  const { name } = await getPackageJson(npmModulePath);
  const packageJson = await getPackageJson(npmProjectPath);

  const dependancyValue = 'file:' + path.relative(npmProjectPath, npmModulePath);

  await savePackageJson(npmProjectPath, {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      [name]: dependancyValue
    }
  });
}

export async function linkLocalDependencies(npmProjectPath) {
  return await linkLocal(npmProjectPath);
}
