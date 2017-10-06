import path from 'path';
import {executeAndHandleError} from "../../services/error-handler";
import {ensureUserIsLoggedIn} from "../../commands/login";
import {getPlatformConfig, getPlatformExtensionsDir} from "../../services/platform";
import { pathExists } from 'fs-extra';
import {uploadExtension} from "../../commands/push";
import {publishExtension} from "../../commands/publish";
import {updateExtension, getInstallation, installExtension} from "../../clients/app-manager";
import confirmer from "../../services/confirmer";

export const description = 'Publish an extension from the app in the working directory';
export const command = 'publish <name>';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ name }) => executeAndHandleError(async () => {
  const dev = await ensureUserIsLoggedIn();
  const extensionPath = path.join(await getPlatformExtensionsDir(), `${dev.name}.${name}`);

  if (!await pathExists(extensionPath)) {
    throw new Error(`Path ${path.relative(process.cwd(), extensionPath)} does not exist`);
  }

  await uploadExtension({ publish: true }, extensionPath);
  const { id: extensionId } = await publishExtension(extensionPath);
  await offerInstallationUpdate(extensionId, name);
  console.log('Success'.green.bold);
});

export async function offerInstallationUpdate(extensionId, extensionName) {
  const { appId } = await getPlatformConfig();
  const dev = await ensureUserIsLoggedIn();
  const canonical = `${dev.name}.${extensionName}`;

  try {
    const { id: installationId } = await getInstallation(appId, canonical);
    const msg = `Do you want to update app ${appId} to the latest version of ${canonical} extension?`;
    if (await confirmer(msg)) {
      await updateExtension(appId, installationId, extensionId);
    }
  } catch (e) {
    if (e.statusCode !== 404) {
      throw e;
    }
    if (await confirmer(`Do you want to install ${canonical} extension to the app ${appId}?`)) {
      await installExtension(appId, extensionId);
    }
  }
}
