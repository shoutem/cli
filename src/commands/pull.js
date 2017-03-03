import { ExtensionManagerClient } from '../clients/extension-manager';
import { AppManagerClient } from '../clients/app-manager';
import { ensureUserIsLoggedIn } from './login';
import { handleError }  from '../extension/error-handler';

export async function pullExtensions({ appId }) {
  try {
    const appManager = new AppManagerClient(await ensureUserIsLoggedIn(), appId);
    const installations = await appManager.getInstallations();

    for (const { extension, canonicalName } of installations) {
      await pullExtension(extension);
    }
  } catch (err) {
    await handleError(err);
  }
}

export async function pullExtension(extId) {
  const extManager = new ExtensionManagerClient(await ensureUserIsLoggedIn());

  console.log(await extManager.getExtension(extId));
}

