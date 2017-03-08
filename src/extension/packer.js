import { exec } from 'mz/child_process';
import fs from 'mz/fs';
import path from 'path';
import bluebird from 'bluebird';
import tmp from 'tmp-promise';
import fs2 from 'fs-extra';
import targz from 'tar.gz';
import { buildNodeProject } from './builder';
import { readJsonFile, writeJsonFile } from './data';
import move from 'glob-move';
import { pathExists } from '../extension/data';
import decompress from 'decompress';

const copy = bluebird.promisify(fs2.copy);

function hasPackageJson(dir) {
  const packageJsonPath = path.join(dir, 'package.json');
  return fs
    .access(packageJsonPath, fs.F_OK)
    .then(() => true)
    .catch(() => false);
}

function npmPack(dir, destinationDir) {
  const resultFilename = `${destinationDir}/${path.basename(dir)}.tgz`;
  const packageJsonPath = `${dir}/package.json`;

  let originalFileContent = null;
  return fs.readFile(packageJsonPath)
    .then(fileContent => {
      originalFileContent = fileContent;
      return readJsonFile(packageJsonPath);
    })
    .then(packageJson => {
      const timestamp = (new Date()).getTime();
      packageJson.version = `${packageJson.version}-build${timestamp}`;
      return writeJsonFile(packageJson, packageJsonPath);
    })
    .then(() => exec('npm pack', { cwd: dir }))
    .then(([stdout]) => {
      const packageFilename = stdout.replace(/\n$/, '');
      const packagePath = path.join(dir, packageFilename);
      return fs.rename(packagePath, resultFilename);
    })
    .catch(err => err)
    .then(err => {
      if (originalFileContent != null) {
        return fs.writeFile(packageJsonPath, originalFileContent, 'utf8');
      } else {
        return Promise.reject(err);
      }
    });
}

export async function npmUnpack(tgzFile, destinationDir) {
  /*if (!(await pathExists(tgzFile))) {
    return [];
  }*/

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
  const extensionJsonPath = path.join(dir, 'extension.json');
  return fs
    .access(extensionJsonPath, fs.F_OK)
    .then(() => true)
    .catch(() => false);
}

export default async function shoutemPack(dir, options) {
  const packedDirectories = ['app', 'server'].map(d => path.join(dir, d));

  if (!await hasExtensionsJson(dir)) {
    throw new Error(`${dir} cannot be packed because it has no extension.json file.`);
  }

  const tmpDir = (await tmp.dir()).path;
  const packageDir = path.join(tmpDir, 'package');
  await fs.mkdir(packageDir);

  const dirsToPack = await bluebird.filter(packedDirectories, hasPackageJson);

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

  return ({
    packedDirs: dirsToPack,
    allDirs: packedDirectories,
    package: destinationDirectory,
  });
}
