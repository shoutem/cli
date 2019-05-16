import fs from 'fs-extra';
import mkdirp from 'mkdirp-promise';
import inquirer from 'inquirer';
import slugify from 'slugify';
import semver from 'semver';
import rmrf from 'rmfr';
import path from 'path';
import 'colors';

import { ensureUserIsLoggedIn } from './login';
import { getExtension } from '../clients/extension-manager';
import { getInstallations, getApplicationPlatform } from '../clients/app-manager';
import { getApp } from '../clients/legacy-service';

import { createProgressHandler } from '../services/progress-bar';
import commandExists from '../services/command-exists';
import selectApp from '../services/app-selector';
import { spinify } from '../services/spinner';
import { decompressFromUrl, decompressFile } from '../services/decompress';
import {
  downloadApp,
  fixPlatform,
  configurePlatform,
  createPlatformConfig,
  setPlatformConfig,
} from '../services/platform';

export async function pullExtensions(appId, destinationDir) {
  const installations = await getInstallations(appId);
  const n = installations.length;
  let i = 0;
  for (const inst of installations) {
    i++;
    await spinify(pullExtension(destinationDir, inst), `Downloading extension ${i}/${n}: ${inst.canonicalName}`,);
  }
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, '');
}

async function getExtensionUrl(extId) {
  const resp = await getExtension(extId);
  const { location: { extension } } = resp;

  return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

export async function unpackExtension(extensionDir, options) {
  const appFile = path.join(extensionDir, 'app.tgz');
  const serverFile = path.join(extensionDir, 'server.tgz');
  const appDir = path.join(extensionDir, 'app');
  const serverDir = path.join(extensionDir, 'server');

  await decompressFile(appFile, appDir, options);
  await decompressFile(serverFile, serverDir, options);
}

async function pullExtension(destinationDir, { extension, canonicalName }) {
  const url = await getExtensionUrl(extension);
  const ext = path.extname(url.split('/').pop());
  const fileName = `extension-${canonicalName}${ext}`;
  const destination = path.join(destinationDir, canonicalName);

  fs.ensureDirSync(destination);

  try {
    await decompressFromUrl(url, destination, { fileName, deleteArchiveWhenDone: true });
    await unpackExtension(destination, { deleteArchiveWhenDone: true });
  } catch (err) {
    err.message = `Could not fetch extension ${canonicalName}\nRequested URL: ${url}\n${err.message}`;
    throw err;
  }
}

function ensurePlatformCompatibility(platform) {
  const msg = `Your app is using Shoutem Platform ${platform.version}` +
    ', but cloning is supported only on Shoutem Platform 1.1.2 or later.\n' +
    'Please, update the Platform through Settings -> Shoutem Platform -> Install page on the Builder or install older (and unsupported) version of ' +
    'the Shoutem CLI by running \'npm install -g @shoutem/cli@0.0.152\'';

  if (semver.lte(platform.version, '1.1.1')) {
    throw new Error(msg);
  }
}

async function queryPathExistsAction(destinationDir, oldDirectoryName) {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: `Directory ${oldDirectoryName} already exists`,
    choices: [{
      name: 'Overwrite',
      value: 'overwrite',
    }, {
      name: 'Abort',
      value: 'abort',
    }, {
      name: 'Different app directory name',
      value: 'rename',
    }],
  });

  if (action === 'overwrite') {
    return { type: 'overwrite' };
  } else if (action === 'abort') {
    return { type: 'abort' };
  }

  const { newDirectoryName } = await inquirer.prompt({
    type: 'input',
    name: 'newDirectoryName',
    message: 'New directory name',
    async validate(dirName) {
      if (dirName.indexOf(' ') > -1) {
        return 'No spaces are allowed';
      }
      if (await fs.pathExists(path.join(destinationDir, dirName))) {
        return `Directory ${dirName} already exists.`;
      }
      return true;
    },
  });

  return {
    type: 'rename',
    newDirectoryName,
    newAppDir: path.join(destinationDir, newDirectoryName),
  };
}

export async function clone(opts, destinationDir) {
  if (!await commandExists('git')) {
    throw new Error('Missing `git` command');
  }
  await ensureUserIsLoggedIn();

  // eslint-disable-next-line no-param-reassign
  opts.appId = opts.appId || await selectApp();

  const { name } = await getApp(opts.appId);

  let directoryName = slugify(opts.dir || name, { remove: /[$*_+~.()'"!\-:@]/g });
  console.log('cloning to', directoryName);
  let appDir = path.join(destinationDir, directoryName);

  if (opts.force) {
    await spinify(rmrf(appDir), `Destroying directory ${directoryName}`);
  }

  if (await fs.pathExists(appDir)) {
    const action = await queryPathExistsAction(destinationDir, directoryName);
    if (action.type === 'overwrite') {
      await spinify(rmrf(appDir), `Destroying directory ${directoryName}`);
    } else if (action.type === 'abort') {
      console.log('Clone aborted.'.bold.yellow);
      return;
    } else {
      directoryName = action.newDirectoryName;
      appDir = action.newAppDir;
    }
  }

  if (appDir.indexOf(' ') >= 0) {
    throw new Error("Path to the directory you are cloning to can't contain spaces.");
  }

  await mkdirp(appDir);

  console.log(`Cloning \`${name}\` to \`${directoryName}\`...`);

  if (opts.platform) {
    await spinify(fs.copy(opts.platform, appDir), 'Copying platform code');
  } else {
    const platform = await getApplicationPlatform(opts.appId);
    ensurePlatformCompatibility(platform);
    await downloadApp(opts.appId, appDir, {
      progress: createProgressHandler({ msg: 'Downloading shoutem platform' }),
      useCache: !opts.force,
      deleteArchiveWhenDone: true,

      versionCheck: (mobileAppVersion) => {
        if (!semver.gte(mobileAppVersion, '0.58.9')) {
          throw new Error('This version of CLI only supports platforms containing mobile app 0.58.9 or higher');
        }
      },
    });
  }

  await pullExtensions(opts.appId, path.join(appDir, 'extensions'));

  await fixPlatform(appDir, opts.appId);

  const config = await createPlatformConfig(appDir, {
    appId: opts.appId,
  });

  setPlatformConfig(appDir, config);

  if (opts.noconfigure) {
    console.log('Skipping configure step due to --noconfigure flag');
  } else {
    await configurePlatform(appDir, config);
  }

  console.log('Done.\n'.green.bold);
  console.log('To run your app on iOS:'.bold);
  console.log(`    cd ${appDir}`);
  console.log('    react-native run-ios');

  console.log('To run your app on Android:'.bold);
  console.log(`    cd ${appDir}`);
  console.log('    Have an Android simulator running or a device connected');
  console.log('    react-native run-android');

  if (!/^win/.test(process.platform) && !await commandExists('watchman')) {
    console.log('HINT: You should probably install Facebook\'s `watchman` before running react-native commands'.bold.yellow);
  }
}
