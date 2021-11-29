import path from 'path';
import { executeAndHandleError } from '../../services/error-handler';
import { ensureUserIsLoggedIn } from '../../commands/login';
import {
  getPlatformConfig,
  getPlatformExtensionsDir,
} from '../../services/platform';
import { pathExists } from 'fs-extra';
import { uploadExtension } from '../../commands/push';
import { publishExtension } from '../../commands/publish';
import {
  updateExtension,
  getInstallation,
  installExtension,
} from '../../clients/app-manager';
import confirmer from '../../services/confirmer';
import { getExtension } from '../../clients/extension-manager';

export const description =
  'Publishes an extension from the app in the specified or current working directory.';
export const command = 'publish <name>';

export async function offerInstallationUpdate(
  extensionId,
  extensionName,
  newVersion,
) {
  const { appId } = await getPlatformConfig();
  const dev = await ensureUserIsLoggedIn();
  const canonical = `${dev.name}.${extensionName}`;

  try {
    const {
      id: installationId,
      extension: oldExtensionId,
    } = await getInstallation(appId, canonical);
    const { version: oldVersion } = await getExtension(oldExtensionId);
    const versionMsg = `${canonical}@${oldVersion} => @${newVersion}`;
    const msg = `Update the version used in the current app (${versionMsg})?`;
    if (await confirmer(msg)) {
      await updateExtension(appId, installationId, extensionId);
    }
  } catch (e) {
    if (e.statusCode !== 404) {
      throw e;
    }
    if (
      await confirmer(
        `Do you want to install ${canonical} extension to the app ${appId}?`,
      )
    ) {
      await installExtension(appId, extensionId);
    }
  }
}

export const builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ name }) =>
  executeAndHandleError(async () => {
    const dev = await ensureUserIsLoggedIn();
    const extensionPath = path.join(
      await getPlatformExtensionsDir(),
      `${dev.name}.${name}`,
    );

    if (!(await pathExists(extensionPath))) {
      throw new Error(
        `Path ${path.relative(process.cwd(), extensionPath)} does not exist`,
      );
    }

    await uploadExtension({ publish: true }, extensionPath);
    const { id: extensionId, version } = await publishExtension(extensionPath);
    await offerInstallationUpdate(extensionId, name, version);
    console.log('Success'.green.bold);
  });
