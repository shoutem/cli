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

    await pullExtension(installations[0].extension);
  } catch (err) {
    await handleError(err);
  }
}

export async function pullExtension(extId) {
  const extManager = new ExtensionManagerClient(await ensureUserIsLoggedIn());
  const { location: {} } = await extManager.getExtension(extId);


  console.log(JSON.stringify(extensionJson, null, 2));
}

