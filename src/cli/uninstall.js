/* eslint no-console: 0 */
import LocalData from '../clients/local-data';
import { AppManagerClient } from '../clients/app-manager';
import * as localExtensions from '../clients/local-extensions';
import { ExtensionManagerClient } from '../clients/extension-manager';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';

const localData = new LocalData();

export const description = `Uninstall current extension from an app.`;
export const command = 'uninstall';
export const builder = {
  app: {
    alias: 'a',
    description: 'uninstall local extension from an app',
    requiresArg: true,
    demand: true
  }
};

export async function handler(args) {
  const appId = args.app;

  try {
    const token = await localData.loadApiToken();
    const extManager = new ExtensionManagerClient(token);

    const canonicalName = await localExtensions.getExtensionCanonicalName();
    const extensionId = await extManager.getExtensionIdAsync(canonicalName);

    if (!extensionId) {
      throw new Error(msg.uninstall.missingExtension());
    }

    const appManager = new AppManagerClient(token, appId);

    const installations = (await appManager.getExtInstallations()).data;
    const installation = installations.filter(inst => inst.extension === extensionId)[0];

    if (!installation) {
      throw new Error(msg.uninstall.missingInstallation());
    }

    appManager.uninstallExtension(installation.id);

    console.log(msg.uninstall.complete());
  } catch (err) {
    handleError(err);
  }
}
