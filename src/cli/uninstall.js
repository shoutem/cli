import {
  uninstallExtension,
  getExtInstallations,
} from '../clients/app-manager';
import * as localExtensions from '../clients/local-extensions';
import { getExtensionId } from '../clients/extension-manager';
import msg from '../user_messages';
import { handleError } from '../services/error-handler';

export const description = 'Uninstalls the current extension from an app.';
export const command = 'uninstall';
export const builder = yargs => {
  return yargs
    .options({
      app: {
        alias: 'a',
        description: 'Uninstalls local extension from an app.',
        requiresArg: true,
        demand: true,
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  const appId = args.app;

  try {
    const canonicalName = await localExtensions.getExtensionCanonicalName();
    const extensionId = await getExtensionId(canonicalName);

    if (!extensionId) {
      throw new Error(msg.uninstall.missingExtension());
    }

    const installations = await getExtInstallations(appId);
    const installation = installations.filter(
      inst => inst.extension === extensionId,
    )[0];

    if (!installation) {
      throw new Error(msg.uninstall.missingInstallation());
    }

    await uninstallExtension(appId, installation.id);

    console.log(msg.uninstall.complete());
  } catch (err) {
    await handleError(err);
  }
}
