import fs from 'fs-extra';
import path from 'path';

import confirmer from '../../services/confirmer';
import { executeAndHandleError } from '../../services/error-handler';
import { getPlatformConfig, getPlatformExtensionsDir } from '../../services/platform';
import { ensureUserIsLoggedIn } from '../../commands/login';
import { uploadExtension } from '../../commands/push';
import { publishExtension } from '../../commands/publish';
import { updateExtension, getInstallation, installExtension } from '../../clients/app-manager';
import { getExtension } from '../../clients/extension-manager';

export const description = 'Publish an extension from the app in the working directory';
export const command = 'publish <name>';
export const builder = yargs => yargs.usage(`shoutem ${command}\n\n${description}`);

export async function offerInstallationUpdate(extensionId, extensionName, newVersion) {
  const { appId } = getPlatformConfig();

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

    if (await confirmer(`Do you want to install ${canonical} extension into app ${appId}?`)) {
      await installExtension(appId, extensionId);
    }
  }
}

async function publish(name) {
  const dev = await ensureUserIsLoggedIn();
  const extensionPath = path.join(getPlatformExtensionsDir(), `${dev.name}.${name}`);

  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Path ${path.relative(process.cwd(), extensionPath)} does not exist`);
  }

  await uploadExtension({ publish: true }, extensionPath);
  const { id: extensionId, version } = await publishExtension(extensionPath);
  await offerInstallationUpdate(extensionId, name, version);
  console.log('Success'.green.bold);
}

export const handler = ({ name }) => executeAndHandleError(publish, name);
