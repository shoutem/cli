import bluebird from 'bluebird';
import tmp from 'tmp-promise';
import path from 'path';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { AppManagerClient } from '../clients/app-manager';
import { ensureUserIsLoggedIn } from './login';
import { handleError }  from '../extension/error-handler';
import { npmUnpack } from '../extension/packer';

const downloadFile = bluebird.promisify(require('download-file'));

export async function pullExtensions({ appId }) {
  try {
    const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
    const installations = await appManager.getInstallations();

    /*for (const { extension, canonicalName } of installations) {
      await pullExtension(extension);
    }*/

    const url = await getExtensionUrl(installations[0].extension);
    const tgzDir = (await tmp.dir()).path;
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
    console.log(tgzDir);
    await npmUnpack(path.join(tgzDir, 'extension.tgz'), process.cwd());
  } catch (err) {
    await handleError(err);
  }
}

async function getExtensionUrl(extId) {
  const extManager = new ExtensionManagerClient(await ensureUserIsLoggedIn());
  const { location: { extension } } = await extManager.getExtension(extId);

 return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, "");
}
