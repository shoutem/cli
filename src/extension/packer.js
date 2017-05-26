import { exec } from 'mz/child_process';
import fs from 'mz/fs';
import path from 'path';
import Promise from 'bluebird';
import tmp from 'tmp-promise';
import targz from 'tar.gz';
import { buildNodeProject } from './builder';
import { readJsonFile, writeJsonFile } from './data';
import { startSpinner } from '../extension/spinner';
import move from 'glob-move';
import { pathExists, copy } from 'fs-extra';
import decompress from 'decompress';
const mv = Promise.promisify(require('mv'));

function hasPackageJson(dir) {
  return pathExists(path.join(dir, 'package.json'));
}

async function npmPack(dir, destinationDir) {
  const resultFilename = path.join(destinationDir, `${path.basename(dir)}.tgz`);
  const packageJsonPath = path.join(dir, 'package.json');

  const originalFileContent = await fs.readFile(packageJsonPath);
  const packageJson = await readJsonFile(packageJsonPath);

  const timestamp = (new Date()).getTime();
  packageJson.version = `${packageJson.version}-build${timestamp}`;

  await writeJsonFile(packageJson, packageJsonPath);
  const [stdout] = await exec('npm pack', { cwd: dir });
  const packageFilename = stdout.replace(/\n$/, '');
  const packagePath = path.join(dir, packageFilename);

  await mv(packagePath, resultFilename);

  if (originalFileContent !== null) {
    await fs.writeFile(packageJsonPath, originalFileContent, 'utf8');
  }
}

export async function npmUnpack(tgzFile, destinationDir) {
  if (!(await pathExists(tgzFile))) {
    return [];
  }

  const tmpDir = (await tmp.dir()).path;
  await decompress(tgzFile, tmpDir);
  return await move(path.join(tmpDir, 'package', '*'), destinationDir, { dot: true });
}

export async function shoutemUnpack(tgzFile, destinationDir) {
  const tmpDir = (await tmp.dir()).path;
  await npmUnpack(tgzFile, tmpDir);

  await npmUnpack(path.join(tmpDir, 'app.tgz'), path.join(destinationDir, 'app'));
  await npmUnpack(path.join(tmpDir, 'server.tgz'), path.join(destinationDir, 'server'));
  await move(path.join(tmpDir, 'extension.json'), destinationDir);
}

function hasExtensionsJson(dir) {
  return pathExists(path.join(dir, 'extension.json'));
}

export default async function shoutemPack(dir, options) {
  const spinner = startSpinner('Packing extension... %s');

  const packedDirectories = ['app', 'server'].map(d => path.join(dir, d));

  if (!await hasExtensionsJson(dir)) {
    throw new Error(`${dir} cannot be packed because it has no extension.json file.`);
  }

  const tmpDir = (await tmp.dir()).path;
  const packageDir = path.join(tmpDir, 'package');
  await fs.mkdir(packageDir);

  const dirsToPack = await Promise.filter(packedDirectories, hasPackageJson);

  if (options.nobuild) {
    console.error('Skipping build step due to --nobuild flag.');
  } else {
    await buildNodeProject(path.join(dir, 'server'));
    await buildNodeProject(path.join(dir, 'app'));
  }

  for (const dir of dirsToPack) {
    await npmPack(dir, packageDir);
  }

  const extensionJsonPathSrc = path.join(dir, 'extension.json');
  const extensionJsonPathDest = path.join(packageDir, 'extension.json');
  await copy(extensionJsonPathSrc, extensionJsonPathDest);

  const destinationDirectory = path.join(options.packToTempDir ? tmpDir : dir, 'extension.tgz');
  await targz().compress(packageDir, destinationDirectory);

  spinner.stop(true);

  return ({
    packedDirs: dirsToPack,
    allDirs: packedDirectories,
    package: destinationDirectory,
  });
}
