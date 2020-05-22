import { exec } from 'child-process-promise';
import fs from 'fs-extra';
import path from 'path';
import Promise from 'bluebird';
import tmp from 'tmp-promise';
import targz from 'tar.gz';
import { buildNodeProject } from './node';
import { writeJsonFile } from './data';
import {spinify} from './spinner';
import move from 'glob-move';
import { pathExists, copy } from 'fs-extra';
import decompress from 'decompress';
import {readJsonFile} from "./data";
import {loadExtensionJson} from "./extension";
import {getPackageJson, savePackageJson} from "./npm";
import {ensureUserIsLoggedIn} from "../commands/login";
import confirmer from "./confirmer";
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
  const { stdout } = await exec('npm pack', { cwd: dir });
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
  if (await pathExists(path.join(tmpDir, 'cloud.tgz'))) {
    await npmUnpack(path.join(tmpDir, 'cloud.tgz'), path.join(destinationDir, 'cloud'));
  }
  await move(path.join(tmpDir, 'extension.json'), destinationDir);
}

function hasExtensionsJson(dir) {
  return pathExists(path.join(dir, 'extension.json'));
}

function hasCloudComponent(dir) {
  return hasPackageJson(path.join(dir, 'cloud'));
}

async function offerDevNameSync(extensionDir) {
  const { name: extensionName } = await loadExtensionJson(extensionDir);

  const syncCloudComponent = await hasCloudComponent(extensionDir);

  const appPackageJson = await getPackageJson(path.join(extensionDir, 'app'));
  const serverPackageJson = await getPackageJson(path.join(extensionDir, 'server'));
  const cloudPackageJson = syncCloudComponent && await getPackageJson(path.join(extensionDir, 'cloud'));

  const { name: appModuleName } = appPackageJson;
  const { name: serverModuleName } = serverPackageJson;
  const { name: cloudModuleName } = cloudPackageJson || {};
  const { name: developerName } = await ensureUserIsLoggedIn(true);

  const targetModuleName = `${developerName}.${extensionName}`;
  if (targetModuleName === appModuleName &&
      targetModuleName === serverModuleName &&
      (!syncCloudComponent || targetModuleName === cloudModuleName)) {
    return;
  }

  if (!await confirmer(`You're uploading an extension that isn't yours, do you want to rename it in the package.json files?`)) {
    return;
  }

  appPackageJson.name = targetModuleName;
  await savePackageJson(path.join(extensionDir, 'app'), appPackageJson);

  serverPackageJson.name = targetModuleName;
  await savePackageJson(path.join(extensionDir, 'server'), serverPackageJson);

  if (syncCloudComponent) {
    cloudPackageJson.name = targetModuleName;
    await savePackageJson(path.join(extensionDir, 'cloud'), cloudPackageJson);
  }
}

export default async function shoutemPack(dir, options) {
  const packedDirectories = ['app', 'server', 'cloud'].map(d => path.join(dir, d));

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

  return await spinify(async () => {
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
  }, 'Packing extension...', 'OK');
}
