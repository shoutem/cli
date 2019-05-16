import tar from 'tar';
import path from 'path';
import tmp from 'tmp-promise';
import Promise from 'bluebird';
import { exec } from 'child-process-promise';
import fs, { pathExists, copy } from 'fs-extra';

import confirmer from './confirmer';
import { spinify } from './spinner';
import { buildNodeProject } from './node';
import { loadExtensionJson } from './extension';
import { readJsonFile, writeJsonFile } from './data';
import npm from './npm';

import { ensureUserIsLoggedIn } from '../commands/login';

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

  writeJsonFile(packageJson, packageJsonPath);

  const { stdout } = await exec('npm pack', { cwd: dir });
  const packageFilename = stdout.replace(/\n$/, '');
  const packagePath = path.join(dir, packageFilename);

  await mv(packagePath, resultFilename);

  if (originalFileContent !== null) {
    fs.writeFileSync(packageJsonPath, originalFileContent, 'utf8');
  }
}

function hasExtensionsJson(dir) {
  return pathExists(path.join(dir, 'extension.json'));
}

async function offerDevNameSync(extensionDir) {
  const { name: extensionName } = loadExtensionJson(extensionDir);

  const appPackageJson = npm.getPackageJson(path.join(extensionDir, 'app'));
  const serverPackageJson = npm.getPackageJson(path.join(extensionDir, 'server'));

  const { name: appModuleName } = appPackageJson;
  const { name: serverModuleName } = serverPackageJson;
  const { name: developerName } = await ensureUserIsLoggedIn(true);

  const targetModuleName = `${developerName}.${extensionName}`;
  if (targetModuleName === appModuleName && targetModuleName === serverModuleName) {
    return;
  }

  if (!await confirmer(`You're uploading an extension that isn't yours, do you want to rename it in the package.json files?`)) {
    return;
  }

  appPackageJson.name = targetModuleName;
  serverPackageJson.name = targetModuleName;

  await npm.savePackageJson(path.join(extensionDir, 'app'), appPackageJson);
  await npm.savePackageJson(path.join(extensionDir, 'server'), serverPackageJson);
}

export default async function shoutemPack(dir, options) {
  const packedDirectories = ['app', 'server'].map(d => path.join(dir, d));

  if (!await hasExtensionsJson(dir)) {
    throw new Error(`${dir} cannot be packed because it has no extension.json file.`);
  }

  await await offerDevNameSync(dir);

  const tmpDir = (await tmp.dir()).path;
  const packageDir = path.join(tmpDir, 'package');

  await fs.mkdir(packageDir);

  const dirsToPack = await Promise.filter(packedDirectories, hasPackageJson);

  if (options.nobuild) {
    console.error('Skipping build step due to --nobuild flag.');
  } else {
    await spinify(buildNodeProject(path.join(dir, 'server')), 'Building the server part...', 'OK');
    await spinify(buildNodeProject(path.join(dir, 'app')), 'Building the app part...', 'OK');
  }

  return spinify(async () => {
    for (const partDir of dirsToPack) {
      await npmPack(partDir, packageDir);
    }

    const extensionJsonPathSrc = path.join(dir, 'extension.json');
    const extensionJsonPathDest = path.join(packageDir, 'extension.json');
    const destinationDir = options.packToTempDir ? tmpDir : dir;
    const destinationPackage = path.join(destinationDir, 'extension.tgz');

    await copy(extensionJsonPathSrc, extensionJsonPathDest);

    try {
      tar.create({
          gzip: true,
          sync: true,
          cwd: tmpDir,
          file: destinationPackage,
        },
        ['package']
      );
    } catch (err) {
      err.message = `TAR error while trying to gzip '${packageDir}' to '${destinationPackage}': ${err.message}`;
      throw err;
    }

    return ({
      packedDirs: dirsToPack,
      allDirs: packedDirectories,
      package: destinationPackage,
    });
  }, 'Packing extension...', 'OK');
}
