import { exec } from 'child-process-promise';
import fs, { pathExists, copy } from 'fs-extra';
import mkdirp from 'mkdirp-promise';
import path from 'path';
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

function hasPackageJson(dir) {
  return pathExists(path.join(dir, 'package.json'));
}

async function packageManagerPack(dir, destinationDir) {
  const resultFilename = path.join(destinationDir, `${path.basename(dir)}.tgz`);
  const packageJsonPath = path.join(dir, 'package.json');

  const originalFileContent = await fs.readFile(packageJsonPath);
  const packageJson = await readJsonFile(packageJsonPath);

  const timestamp = new Date().getTime();
  packageJson.version = `${packageJson.version}-build${timestamp}`;

  await writeJsonFile(packageJson, packageJsonPath);
  const { stdout } = await exec(`${packageManager} pack`, { cwd: dir });
  const packageFilename = stdout.replace(/\n$/, '');
  const packagePath = path.join(dir, packageFilename);

  await mv(packagePath, resultFilename);

  if (originalFileContent !== null) {
    await fs.writeFile(packageJsonPath, originalFileContent, 'utf8');
  }
}

export async function packageManagerUnpack(
  tgzFile,
  decompressPath,
) {
  if (!(await pathExists(tgzFile))) {
    return [];
  }

  if (!(await pathExists(decompressPath))) {
    await mkdirp(decompressPath);
  }

  await decompress(tgzFile, decompressPath);

  return path.join(decompressPath, 'package');
}

export async function shoutemUnpack(tgzDir, destinationDir) {
  const tgzFile = path.join(tgzDir, 'extension.tgz');

  // Extracts extension.tgz into same directory, which then contains:
  // app.tgz, server.tgz, extension.json and optional cloud.tgz
  const extDecompressPath = await packageManagerUnpack(tgzFile, tgzDir)
  const segments = ['app', 'cloud', 'server'];

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
  })

  fs.copySync(
    path.join(extDecompressPath, 'extension.json'),
    path.join(destinationDir, 'extension.json'),
  );
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

  const dirsToPack = await Promise.filter(packedDirectories, hasPackageJson);

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
