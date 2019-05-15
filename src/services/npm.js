import path from 'path';
import Promise from 'bluebird';
import { spawn } from 'child-process-promise';

import { writeJsonFile, readJsonFile } from './data';

const linkLocal = Promise.promisify(require('linklocal'));

function install(cwd = process.cwd()) {
  return spawn('npm', ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true },
  });
}

function run(cwd, task, taskArgs = [], npmOptions = []) {
  const opts = {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };

  const spawned = taskArgs.length ?
    spawn('npm', ['run', task, ...npmOptions, '--', ...taskArgs], opts) :
    spawn('npm', ['run', task, ...npmOptions], opts);

  return spawned;
}

function getPackageJson(npmProjectPath) {
  return readJsonFile(path.join(npmProjectPath, 'package.json'));
}

function savePackageJson(npmProjectPath, pkgJson) {
  return writeJsonFile(path.join(npmProjectPath, 'package.json'), pkgJson);
}

function addLocalDependency(npmProjectPath, npmModulePath) {
  const { name } = getPackageJson(npmModulePath);
  const packageJson = getPackageJson(npmProjectPath);

  const dependencyValue = `file:${path.relative(npmProjectPath, npmModulePath)}`;

  savePackageJson(npmProjectPath, {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      [name]: dependencyValue,
    },
  });
}

function linkLocalDependencies(npmProjectPath) {
  return linkLocal(npmProjectPath);
}

export default {
  run,
  install,
  getPackageJson,
  savePackageJson,
  addLocalDependency,
  linkLocalDependencies,
};
