import path from 'path';
import Promise from 'bluebird';
import fs from 'fs-extra';
import { spawn } from 'child-process-promise';
import { getDefaultPackageManager } from '../clients/default-package-manager';

const linkLocal = Promise.promisify(require('linklocal'));

export const packageManager = getDefaultPackageManager();

export async function install(cwd = process.cwd()) {
  await spawn(packageManager, ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true },
  });
}

export async function run(
  cwd,
  task,
  taskArgs = [],
  packagerOptions = [],
) {
  const opts = {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };

  const spawned = taskArgs.length
    ? spawn(packageManager, ['run', task, ...packagerOptions, '--', ...taskArgs], opts)
    : spawn(packageManager, ['run', task, ...packagerOptions], opts);

  return spawned;
}

export function getPackageJson(projectPath) {
  return fs.readJsonSync(path.join(projectPath, 'package.json'));
}

export async function savePackageJson(projectPath, pkgJson) {
  return fs.writeJsonSync(path.join(projectPath, 'package.json'), pkgJson);
}

export async function addLocalDependency(projectPath, modulePath) {
  const { name } = getPackageJson(modulePath);
  const packageJson = getPackageJson(projectPath);

  const dependencyValue = `file:${path.relative(projectPath, modulePath)}`;

  await savePackageJson(projectPath, {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      [name]: dependencyValue,
    },
  });
}

export async function linkLocalDependencies(projectPath) {
  return linkLocal(projectPath);
}
