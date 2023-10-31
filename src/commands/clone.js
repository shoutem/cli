import Promise from 'bluebird';
import _ from 'lodash';
import mkdirp from 'mkdirp-promise';
import tmp from 'tmp-promise';
import rmrf from 'rmfr';
import path from 'path';
import semver from 'semver';
import inquirer from 'inquirer';
import { getExtension } from '../clients/extension-manager';
import * as appManager from '../clients/app-manager';
import { shoutemUnpack } from '../services/packer';
import { getApp } from '../clients/legacy-service';
import { pathExists, copy } from 'fs-extra';
import selectApp from '../services/app-selector';
import {
  downloadApp,
  fixPlatform,
  configurePlatform,
  createPlatformConfig,
  setPlatformConfig,
} from '../services/platform';
import { ensureUserIsLoggedIn } from './login';
import { createProgressHandler } from '../services/progress-bar';
import { spinify } from '../services/spinner';
import commandExists from '../services/command-exists';
import slugify from 'slugify';
import 'colors';

const downloadFile = Promise.promisify(require('download-file'));

const tmpPaths = [];

function removeTrailingSlash(str) {
  return str.replace(/\/$/, '');
}

function getDownloadExtensionConcurrency() {
  if (process.env.DOWNLOAD_EXTENSION_CONCURRENCY) {
    return parseInt(process.env.DOWNLOAD_EXTENSION_CONCURRENCY)
  }

  return 1;
}

function getExtensionUrlFromInstallation(installation) {
  const extensionPackage = _.get(installation, 'location.extension.package');
  return `${removeTrailingSlash(extensionPackage)}/extension.tgz`;
}

async function pullExtension(destinationDir, installation) {
  const { canonicalName } = installation
  let pullError = null;
  
  const tgzDir = (await tmp.dir()).path;
  tmpPaths.push(tgzDir);

  try {
    const url = getExtensionUrlFromInstallation(installation)
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });

    const extensionDir = path.join(destinationDir, canonicalName);

    if (!(await pathExists(extensionDir))) {
      await mkdirp(extensionDir);
    }

    await shoutemUnpack(tgzDir, extensionDir);

    pullError = null;

    return;
  } catch (error) {
    if (error.code !== 'ENOTEMPTY') {
      pullError = error;
    }
  }

  if (!_.isEmpty(pullError)) {
    pullError.message = `Could not fetch extension ${canonicalName}.`;
    throw pullError;
  }
}

export async function pullExtensions(appId, destinationDir) {
  const concurrency = getDownloadExtensionConcurrency();
  console.log(`Download extensions concurrency: ${concurrency}`)

  console.time('Extension download took');
  const installations = await appManager.getInstallations(appId);

  await Promise.map(installations, inst => spinify(
    pullExtension(destinationDir, inst),
    `Downloading extension: ${inst.canonicalName}...`,
  ), { concurrency });
 
  console.timeEnd('Extension download took');

  // Cleanup of temporary directories created for downloading extensions.
  console.time('Temp file cleanup took')
  await Promise.map(tmpPaths, tmpPath => rmrf(tmpPath));
  console.timeEnd('Temp file cleanup took')
}

function ensurePlatformCompatibility(platform) {
  const msg =
    `Your app is using Shoutem Platform ${platform.version}` +
    `, but cloning is supported only on Shoutem Platform 1.1.2 or later.\n` +
    `Please, update the Platform through Settings -> Shoutem Platform -> Install page on the Builder or install older (and unsupported) version of ` +
    `the Shoutem CLI by running 'npm install -g @shoutem/cli@0.0.152'`;

  if (semver.lte(platform.version, '1.1.1')) {
    throw new Error(msg);
  }
}

async function queryPathExistsAction(destinationDir, oldDirectoryName) {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: `Directory ${oldDirectoryName} already exists.`,
    choices: [
      {
        name: 'Overwrite',
        value: 'overwrite',
      },
      {
        name: 'Abort',
        value: 'abort',
      },
      {
        name: 'Different app directory name',
        value: 'rename',
      },
    ],
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
        return 'No spaces are allowed.';
      }
      if (await pathExists(path.join(destinationDir, dirName))) {
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
  if (!(await commandExists('git'))) {
    throw new Error('Missing `git` command');
  }
  await ensureUserIsLoggedIn();

  opts.appId = opts.appId || (await selectApp());

  const { name } = await getApp(opts.appId);

  let directoryName = slugify(opts.dir || name, {
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  console.log('cloning to', directoryName);
  let appDir = path.join(destinationDir, directoryName);

  if (opts.force) {
    await spinify(rmrf(appDir), `Destroying directory ${directoryName}...`);
  }

  if (await pathExists(appDir)) {
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
    throw new Error(
      "Path to the directory you are cloning to can't contain spaces.",
    );
  }

  await mkdirp(appDir);

  console.log(`Cloning \`${name}\` to \`${directoryName}\`...`);

  if (opts.platform) {
    await spinify(copy(opts.platform, appDir), 'Copying platform code...');
  } else {
    const platform = await appManager.getApplicationPlatform(opts.appId);
    ensurePlatformCompatibility(platform);
    await downloadApp(opts.appId, appDir, {
      progress: createProgressHandler({ msg: 'Downloading shoutem platform.' }),
      useCache: !opts.force,

      versionCheck: mobileAppVersion => {
        if (!semver.gte(mobileAppVersion, '0.58.9')) {
          throw new Error(
            'This version of CLI only supports platforms containing mobile app 0.58.9 or higher.',
          );
        }
      },
    });
  }

  const extensionsDir = path.join(appDir, 'extensions');

  if (!(await pathExists(extensionsDir))) {
    await mkdirp(extensionsDir);
  }

  await pullExtensions(opts.appId, extensionsDir);

  await fixPlatform(appDir, opts.appId);

  const config = await createPlatformConfig(appDir, {
    appId: opts.appId,
  });
  await setPlatformConfig(appDir, config);

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

  if (!/^win/.test(process.platform) && !(await commandExists('watchman'))) {
    console.log(
      "HINT: You should probably install Facebook's `watchman` before running react-native commands"
        .bold.yellow,
    );
  }
}
