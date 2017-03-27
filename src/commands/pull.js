import bluebird from 'bluebird';
import mkdirp from 'mkdirp-promise';
import tmp from 'tmp-promise';
import path from 'path';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { AppManagerClient } from '../clients/app-manager';
import { ensureUserIsLoggedIn } from './login';
import { shoutemUnpack } from '../extension/packer';
import decompressUri from '../extension/decompress';
import { preparePlatform } from '../extension/platform';
import apiUrls from '../../config/services';
import { LegacyServiceClient } from '../clients/legacy-service';
import { pathExists } from '../extension/data';
import selectApp from '../extension/app-selector';

const downloadFile = bluebird.promisify(require('download-file'));

export async function pullExtensions({ appId }, destinationDir) {
  const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
  const installations = await appManager.getInstallations();

  await Promise.all(installations.map(async ({ extension, canonicalName }) => {
    const url = await getExtensionUrl(extension);
    const tgzDir = (await tmp.dir()).path;
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
    await shoutemUnpack(path.join(tgzDir, 'extension.tgz'), path.join(destinationDir, canonicalName));
  }));
}

async function getExtensionUrl(extId) {
  const extManager = new ExtensionManagerClient(await ensureUserIsLoggedIn());
  const resp = await extManager.getExtension(extId);
  const { location: { extension } } = resp;

 return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, "");
}

export async function pullPlatform(version, destination) {
  const url = `${apiUrls.mobileAppUrl}/archive/v${version}.tar.gz`;
  await decompressUri(url, destination, { strip: 1 });
}

export async function pullApp({ appId }, destinationDir) {
  appId = appId || await selectApp();

  const { attributes: { name } } = await new LegacyServiceClient(await ensureUserIsLoggedIn()).getApp(appId);
  const spacelessName = name.replace(/ /g, '_');

  const appDir = path.join(destinationDir, spacelessName);
  if (await pathExists(appDir)) {
    throw new Error(`Directory ${appDir} already exists`);
  }
  if (appDir.indexOf(' ') >= 0) {
    throw new Error('Due to a bug in the `npm`, app\'s path can\'t contain spaces');
  }

  await mkdirp(appDir);

  const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
  const { mobileAppVersion } = await appManager.getApplicationPlatform();

  console.log(`Pulling the app \`${name}\`...`);
  await Promise.all([
    pullExtensions({ appId }, path.join(appDir, 'extensions'))
      .then(() => console.log('Pulling extensions...')),
    pullPlatform(mobileAppVersion, appDir)]
  );
/*
  if (process.platform === 'darwin') {
    await preparePlatform(appDir, { platform: ['ios', 'android'], appId });
  } else {
    await preparePlatform(appDir, {platform: 'android', appId});
  }

  console.log('Success!');
  */
  console.log(`Change your working directory to \`${spacelessName}\``);
}
