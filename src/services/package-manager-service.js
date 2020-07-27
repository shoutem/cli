import path from 'path';
import Promise from 'bluebird';
import { readJson } from 'fs-extra';
import { spawn } from 'child-process-promise';
import { getDefaultPackageManager } from '../clients/default-package-manager';
import { writeJsonFile } from './data';
const linkLocal = Promise.promisify(require('linklocal'));

export const packageManager = getDefaultPackageManager();

export async function install(
  resolvedPackageManager = packageManager, // use default if none provided
  cwd = process.cwd()
) {
  await spawn(resolvedPackageManager, ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true }
  });
}

export async function run(
  resolvedPackageManager = packageManager, // use default if none provided
  cwd,
  task,
  taskArgs = [],
  packagerOptions = []
) {
  const opts = {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
  };

  const spawned = taskArgs.length ?
    spawn(resolvedPackageManager, ['run', task, ...packagerOptions, '--', ...taskArgs], opts) :
    spawn(resolvedPackageManager, ['run', task, ...packagerOptions], opts);

  return await spawned;
}

export async function getPackageJson(projectPath) {
  return await readJson(path.join(projectPath, 'package.json'));
}

export async function savePackageJson(projectPath, pkgJson) {
  return await writeJsonFile(pkgJson, path.join(projectPath, 'package.json'));
}

export async function addLocalDependency(projectPath, modulePath) {
  const { name } = await getPackageJson(modulePath);
  const packageJson = await getPackageJson(projectPath);

  const dependencyValue = 'file:' + path.relative(projectPath, modulePath);

  await savePackageJson(projectPath, {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      [name]: dependencyValue
    }
  });
}

export async function linkLocalDependencies(projectPath) {
  return await linkLocal(projectPath);
}
