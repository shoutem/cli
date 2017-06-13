import Promise from 'bluebird';
import mkdirp from 'mkdirp-promise';
import tmp from 'tmp-promise';
import path from 'path';
import { getExtension } from '../clients/extension-manager';
import * as appManager from '../clients/app-manager';
import { shoutemUnpack } from '../extension/packer';
import { getApp } from '../clients/legacy-service';
import { pathExists, copy } from 'fs-extra';
import selectApp from '../extension/app-selector';
import { downloadApp } from '../extension/platform';
import { ensureUserIsLoggedIn } from './login';
import { createProgressBar } from '../extension/progress-bar';
import { spinify } from '../extension/spinner';

const downloadFile = Promise.promisify(require('download-file'));

export async function pullExtensions(appId , destinationDir) {
  const installations = await appManager.getInstallations(appId);

  await Promise.all(installations.map(async ({ extension, canonicalName }) => {
    const url = await getExtensionUrl(extension);
    const tgzDir = (await tmp.dir()).path;
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
    await shoutemUnpack(path.join(tgzDir, 'extension.tgz'), path.join(destinationDir, canonicalName));
  }));
}

async function getExtensionUrl(extId) {
  const resp = await getExtension(extId);
  const { location: { extension } } = resp;

 return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, "");
}

export async function clone({ appId, platform }, destinationDir) {
  await ensureUserIsLoggedIn();
  appId = appId || await selectApp();

  const { name } = await getApp(appId);
  const directoryName = `${name.replace(/ /g, '_')}_${appId}`;

  const appDir = path.join(destinationDir, directoryName);
  if (await pathExists(appDir)) {
    throw new Error(`Directory ${directoryName} already exists`);
  }
  if (appDir.indexOf(' ') >= 0) {
    throw new Error('Due to a bug in the `npm`, app\'s path can\'t contain spaces');
  }

  await mkdirp(appDir);

  console.log(`Pulling the app \`${name}\`...`);

  if (platform) {
    await spinify(copy(platform, appDir), 'Copying platform code');
  } else {
    await downloadApp(appId, appDir, { progress: createProgressBar('Downloading shoutem platform') });
  }

  await spinify(pullExtensions(appId, path.join(appDir, 'extensions')), 'Downloading extensions');

  console.log(`Your app is now ready. Change directory to \`${directoryName}\` and run it with \`react-native run-android/ios\` or \`shoutem run\` with shoutem preview app.`);
}
