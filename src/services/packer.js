import { exec } from 'promisify-child-process';
import fs, { pathExists, copy } from 'fs-extra';
import { mkdirp } from 'mkdirp';
import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import tmp from 'tmp-promise';
import targz from 'tar.gz';
import { buildNodeProject } from './node';
import { writeJsonFile, readJsonFile } from './data';
import { spinify } from './spinner';
import rmrf from 'rmfr';
import decompress from 'decompress';
import { loadExtensionJson } from './extension';
import {
  packageManager,
  getPackageJson,
  savePackageJson,
} from './package-manager-service';
import { ensureUserIsLoggedIn } from '../commands/login';
import confirmer from './confirmer';
const mv = Promise.promisify(require('mv'));

// BUN doesn't support pack at the moment, so in that case we default to npm
const resolvedPacker = packageManager === 'bun' ? 'npm' : packageManager;

function hasPackageJson(dir) {
  return pathExists(path.join(dir, 'package.json'));
}

async function packageManagerPack(dir, destinationDir) {
  const component = path.basename(dir);
  const resultFilename = path.join(destinationDir, `${component}.tgz`);
  const isWeb = component === 'web';
  const appDir = isWeb ? dir.replace('web', 'app') : dir;

  const packageJsonPath = path.join(appDir, 'package.json');

  const originalFileContent = await fs.readFile(packageJsonPath);
  const packageJson = await readJsonFile(packageJsonPath);

  const timestamp = new Date().getTime();
  packageJson.version = `${packageJson.version}-build${timestamp}`;
  packageJson.dependencies = isWeb
    ? packageJson.webDependencies
    : packageJson.dependencies;

  await writeJsonFile(packageJson, packageJsonPath);
  const { stdout } = await exec(`${resolvedPacker} pack`, { cwd: appDir });
  const packageFilename = stdout.replace(/\n$/, '');
  const packagePath = path.join(appDir, packageFilename);

  await mv(packagePath, resultFilename);

  if (originalFileContent !== null) {
    await fs.writeFile(packageJsonPath, originalFileContent, 'utf8');
  }
}

export async function packageManagerUnpack(tgzFile, decompressPath) {
  if (!(await pathExists(tgzFile))) {
    return [];
  }

  if (!(await pathExists(decompressPath))) {
    await mkdirp(decompressPath);
  }

  await decompress(tgzFile, decompressPath);

  return path.join(decompressPath, 'package');
}

export async function shoutemUnpack(tgzDir, destinationDir, extSegments) {
  const tgzFile = path.join(tgzDir, 'extension.tgz');

  // Extracts extension.tgz into same directory, which then contains:
  // app.tgz, server.tgz, extension.json and optional cloud.tgz
  const extDecompressPath = await packageManagerUnpack(tgzFile, tgzDir);

  let segments = ['app', 'cloud', 'server'];
  // custome ext segments
  if (!_.isEmpty(extSegments)) {
    segments = _.split(extSegments, ',');
  }

  await Promise.map(segments, async segment => {
    const tgzPath = path.join(extDecompressPath, `${segment}.tgz`);

    if (await pathExists(tgzPath)) {
      const decompressPath = path.join(extDecompressPath, segment);
      const segmentPath = await packageManagerUnpack(tgzPath, decompressPath);
      const segmentDestinationPath = path.join(destinationDir, segment);

      if (!(await pathExists(segmentDestinationPath))) {
        await mkdirp(segmentDestinationPath);
      }

      await fs.copy(segmentPath, segmentDestinationPath);

      // We delete the 'package' decompress directory so that we don't mix
      // segment files.
      await rmrf(decompressPath);
    }
  });

  fs.copySync(
    path.join(extDecompressPath, 'extension.json'),
    path.join(destinationDir, 'extension.json'),
  );
}

function hasExtensionsJson(dir) {
  return pathExists(path.join(dir, 'extension.json'));
}

async function hasWebDependencies(dir) {
  const packageJsonPath = path.join(dir, 'app', 'package.json');

  const packageJson = await readJsonFile(packageJsonPath);

  if (!packageJson.webDependencies) {
    return false;
  }

  return true;
}

function hasCloudComponent(dir) {
  return hasPackageJson(path.join(dir, 'cloud'));
}

async function offerDevNameSync(extensionDir) {
  const { name: extensionName } = await loadExtensionJson(extensionDir);

  const syncCloudComponent = await hasCloudComponent(extensionDir);

  const appPackageJson = await getPackageJson(path.join(extensionDir, 'app'));
  const serverPackageJson = await getPackageJson(
    path.join(extensionDir, 'server'),
  );
  const cloudPackageJson =
    syncCloudComponent &&
    (await getPackageJson(path.join(extensionDir, 'cloud')));

  const { name: appModuleName } = appPackageJson;
  const { name: serverModuleName } = serverPackageJson;
  const { name: cloudModuleName } = cloudPackageJson || {};
  const { name: developerName } = await ensureUserIsLoggedIn(true);

  const targetModuleName = `${developerName}.${extensionName}`;
  if (
    targetModuleName === appModuleName &&
    targetModuleName === serverModuleName &&
    (!syncCloudComponent || targetModuleName === cloudModuleName)
  ) {
    return;
  }

  if (
    !(await confirmer(
      `You're uploading an extension that isn't yours, do you want to rename it in the package.json files?`,
    ))
  ) {
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
  const components = ['app', 'server'];
  const hasCloud = await hasCloudComponent(dir);

  if (hasCloud) {
    components.push('cloud');
  }

  const hasWeb = await hasWebDependencies(dir);

  if (hasWeb) {
    components.push('web');
  }

  const packedDirectories = components.map(d => path.join(dir, d));

  if (!(await hasExtensionsJson(dir))) {
    throw new Error(
      `${dir} cannot be packed because it has no extension.json file.`,
    );
  }

  await await offerDevNameSync(dir);

  const tmpDir = (await tmp.dir()).path;
  const packageDir = path.join(tmpDir, 'package');
  await fs.mkdir(packageDir);

  const filteredDirsToPack = await Promise.filter(
    packedDirectories,
    hasPackageJson,
  );
  // We still want to pack the web segment even though it uses package.json
  // from the app segment
  const dirsToPack = hasWeb
    ? [...filteredDirsToPack, path.join(dir, 'web')]
    : filteredDirsToPack;

  if (options.nobuild) {
    console.error('Skipping build step due to --nobuild flag.');
  } else {
    await spinify(
      buildNodeProject(path.join(dir, 'server')),
      'Building the server part...',
      'OK',
    );
    await spinify(
      buildNodeProject(path.join(dir, 'app')),
      'Building the app part...',
      'OK',
    );
  }

  return await spinify(
    async () => {
      for (const dir of dirsToPack) {
        await packageManagerPack(dir, packageDir);
      }
      const extensionJsonPathSrc = path.join(dir, 'extension.json');
      const extensionJsonPathDest = path.join(packageDir, 'extension.json');
      await copy(extensionJsonPathSrc, extensionJsonPathDest);

      const destinationDirectory = path.join(
        options.packToTempDir ? tmpDir : dir,
        'extension.tgz',
      );
      await targz().compress(packageDir, destinationDirectory);

      return {
        packedDirs: dirsToPack,
        allDirs: packedDirectories,
        package: destinationDirectory,
      };
    },
    'Packing extension...',
    'OK',
  );
}
