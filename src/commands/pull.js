import bluebird from 'bluebird';
import tmp from 'tmp-promise';
import path from 'path';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { AppManagerClient } from '../clients/app-manager';
import { ensureUserIsLoggedIn } from './login';
import { handleError }  from '../extension/error-handler';
import { shoutemUnpack } from '../extension/packer';

const downloadFile = bluebird.promisify(require('download-file'));

export async function pullExtensions({ appId }) {
  try {
    const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
    const installations = await appManager.getInstallations();

    await Promise.all(installations.map(async ({ extension, canonicalName }) => {
      const url = await getExtensionUrl(extension);
      const tgzDir = (await tmp.dir()).path;
      await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
      await shoutemUnpack(path.join(tgzDir, 'extension.tgz'), path.join(process.cwd(), 'extensions', canonicalName));
    }));

  } catch (err) {
    await handleError(err);
  }
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
