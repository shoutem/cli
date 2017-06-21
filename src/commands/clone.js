import Promise from 'bluebird';
import mkdirp from 'mkdirp-promise';
import tmp from 'tmp-promise';
import rmrf from 'rmfr';
import path from 'path';
import { getExtension } from '../clients/extension-manager';
import * as appManager from '../clients/app-manager';
import { shoutemUnpack } from '../extension/packer';
import { getApp } from '../clients/legacy-service';
import { pathExists, copy } from 'fs-extra';
import selectApp from '../extension/app-selector';
import { downloadApp, fixPlatform, configurePlatform, createMobileConfig } from '../extension/platform';
import { ensureUserIsLoggedIn } from './login';
import { createProgressBar } from '../extension/progress-bar';
import { spinify } from '../extension/spinner';
import { clearCache } from '../extension/decompress';
import commandExists from '../extension/command-exists';
import 'colors';

const downloadFile = Promise.promisify(require('download-file'));

export async function pullExtensions(appId, destinationDir) {
  const installations = await appManager.getInstallations(appId);
  await Promise.all(installations.map(inst => pullExtension(destinationDir, inst)));
}

async function pullExtension(destinationDir, { extension, canonicalName }) {
  try {
    const url = await getExtensionUrl(extension);
    const tgzDir = (await tmp.dir()).path;
    await downloadFile(url, {directory: tgzDir, filename: 'extension.tgz'});
    await shoutemUnpack(path.join(tgzDir, 'extension.tgz'), path.join(destinationDir, canonicalName));
  } catch (err) {
    err.message = `Could not fetch extension ${canonicalName}`;
    throw err;
  }
}

async function getExtensionUrl(extId) {
  const resp = await getExtension(extId);
  const { location: { extension } } = resp;

 return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, "");
}

const excludePackages = [
  'shoutem.firebase',
  'shoutem.notification-center',
  'shoutem.push-notifications',
  'shoutem.shoutem-notification-center',
  'shoutem.code-push'
];

export async function clone(opts, destinationDir) {
  if (!await commandExists('git')) {
    throw new Error('Missing `git` command');
  }
  await ensureUserIsLoggedIn();

  opts.appId = opts.appId || await selectApp();

  const { name } = await getApp(opts.appId);
  const directoryName = opts.dir || `${name.replace(/ /g, '_')}_${opts.appId}`;

  const appDir = path.join(destinationDir, directoryName);

  if (opts.force) {
    await clearCache();
    await spinify(rmrf(appDir), `Destroying directory ${directoryName}`);
  } else if (await pathExists(appDir)) {
    throw new Error(`Directory ${directoryName} already exists`);
  }

  if (appDir.indexOf(' ') >= 0) {
    throw new Error('Due to a bug in the `npm`, app\'s path can\'t contain spaces');
  }

  await mkdirp(appDir);

  console.log(`Cloning \`${name}\` to \`${directoryName}\`...`);

  if (opts.platform) {
    await spinify(copy(opts.platform, appDir), 'Copying platform code');
  } else {
    await downloadApp(opts.appId, appDir, { progress: createProgressBar('Downloading shoutem platform') });
  }

  await spinify(pullExtensions(opts.appId, path.join(appDir, 'extensions')), 'Downloading extensions');

  await fixPlatform(appDir, opts.appId);
  if (!opts.noconfigure) {
    const config = await createMobileConfig(appDir, {
      appId: opts.appId,
      excludePackages
    });
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
