import Promise from 'bluebird';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp-promise';
import path from 'path';
import rmrf from 'rmfr';
import semver from 'semver';
import slugify from 'slugify';
import tmp from 'tmp-promise';

import * as appManager from '../clients/app-manager';
import { getExtension } from '../clients/extension-manager';
import { getApp } from '../clients/legacy-service';
import selectApp from '../services/app-selector';
import commandExists from '../services/command-exists';
import { shoutemUnpack } from '../services/packer';
import {
  downloadApp,
  fixPlatform,
  configurePlatform,
  createPlatformConfig,
  setPlatformConfig,
} from '../services/platform';
import createProgressHandler from '../services/progress-bar';
import { spinify } from '../services/spinner';
import { ensureUserIsLoggedIn } from './login';

import 'colors';

const downloadFile = Promise.promisify(require('download-file'));

function removeTrailingSlash(str) {
  return str.replace(/\/$/, '');
}

async function getExtensionUrl(extId) {
  const resp = await getExtension(extId);
  const { location: { extension } } = resp;

  return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

async function pullExtension(destinationDir, { extension, canonicalName }) {
  try {
    const url = await getExtensionUrl(extension);
    const tgzDir = (await tmp.dir()).path;
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
    await shoutemUnpack(path.join(tgzDir, 'extension.tgz'), path.join(destinationDir, canonicalName));
  } catch (err) {
    err.message = `Could not fetch extension ${canonicalName}.`;
    throw err;
  }
}

export async function pullExtensions(appId, destinationDir) {
  const installations = await appManager.getInstallations(appId);
  const n = installations.length;
  let i = 0;
  // eslint doesn't play well with loops and we have no alternative due to the use of await
  /* eslint-disable */
  for(const inst of installations) {
    i++;
    await spinify(pullExtension(destinationDir, inst), `Downloading extension ${i}/${n}: ${inst.canonicalName}...`);
  }
  /* eslint-enable */
}

function ensurePlatformCompatibility(platform) {
  const msg = `Your app is using Shoutem Platform ${platform.version}, `
    + 'but cloning is supported only on Shoutem Platform 1.1.2 or later.\n'
    + 'Please, update the Platform through Settings -> Shoutem Platform -> Install page on the Builder '
    + 'or install an older (and unsupported) version of the Shoutem CLI by running '
    + '\'npm install -g @shoutem/cli@0.0.152\'';

  if (semver.lte(platform.version, '1.1.1')) {
    throw new Error(msg);
  }
}

async function queryPathExistsAction(destinationDir, oldDirectoryName) {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: `Directory ${oldDirectoryName} already exists.`,
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
  }

  if (action === 'abort') {
    return { type: 'abort' };
  }

  const { newDirectoryName } = await inquirer.prompt({
    type: 'input',
    name: 'newDirectoryName',
    message: 'New directory name',
    async validate(dirName) {
      if (dirName.indexOf(' ') > -1) {
        return 'No spaces are allowed.';
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

export async function clone(options, destinationDir) {
  if (!await commandExists('git')) {
    throw new Error('Missing `git` command');
  }
  await ensureUserIsLoggedIn();

  // no-irregular-whitespace makes no sense for the space before 'await'
  // eslint-disable-next-line
  const resolvedOptions = { ...options, appId: options.appId || await selectApp() };
  const { name } = await getApp(resolvedOptions.appId);

  let directoryName = slugify(resolvedOptions.dir || name, { remove: /[$*_+~.()'"!\-:@]/g });
  console.log('cloning to', directoryName);
  let appDir = path.join(destinationDir, directoryName);

  if (resolvedOptions.force) {
    await spinify(rmrf(appDir), `Destroying directory ${directoryName}...`);
  }

  if (await fs.pathExists(appDir)) {
    const action = await queryPathExistsAction(destinationDir, directoryName);
    if (action.type === 'overwrite') {
      await spinify(rmrf(appDir), `Destroying directory ${directoryName}...`);
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

  if (resolvedOptions.platform) {
    await spinify(fs.copy(resolvedOptions.platform, appDir), 'Copying platform code...');
  } else {
    const platform = await appManager.getApplicationPlatform(resolvedOptions.appId);
    ensurePlatformCompatibility(platform);
    await downloadApp(resolvedOptions.appId, appDir, {
      progress: createProgressHandler({ msg: 'Downloading shoutem platform.' }),
      useCache: !resolvedOptions.force,
      versionCheck: (mobileAppVersion) => {
        if (!semver.gte(mobileAppVersion, '0.58.9')) {
          throw new Error('This version of CLI only supports platforms containing mobile app 0.58.9 or higher.');
        }
      },
    });
  }

  await pullExtensions(resolvedOptions.appId, path.join(appDir, 'extensions'));

  await fixPlatform(appDir, resolvedOptions.appId);

  const config = await createPlatformConfig(appDir, {
    appId: resolvedOptions.appId,
  });
  await setPlatformConfig(appDir, config);

  if (resolvedOptions.noconfigure) {
    console.log('Skipping configure step due to --noconfigure flag');
  } else {
    await configurePlatform(appDir, config);
    console.log('Done.\n'.green.bold);
    console.log('To run your app on iOS:'.bold);
    console.log(`    cd ${appDir}`);
    console.log('    react-native run-ios');

    console.log('To run your app on Android:'.bold);
    console.log(`    cd ${appDir}`);
    console.log('    Have an Android simulator running or a device connected');
    console.log('    react-native run-android');
  }

  if (!/^win/.test(process.platform) && !await commandExists('watchman')) {
    console.log('HINT: You should probably install Facebook\'s `watchman` before running react-native commands'.bold.yellow);
  }
}
