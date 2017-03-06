import { ExtensionManagerClient } from '../clients/extension-manager';
import { AppManagerClient } from '../clients/app-manager';
import { ensureUserIsLoggedIn } from './login';
import { handleError }  from '../extension/error-handler';

export async function pullExtensions({ appId }) {
  try {
    const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
    const installations = await appManager.getInstallations();

    /*for (const { extension, canonicalName } of installations) {
      await pullExtension(extension);
    }*/

    await getExtensionUrl(installations[0].extension);
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
