/* eslint no-console: "off" */
import path from 'path';
import { mobileAppConfigPath } from '../../clients/cli-paths';
import { ensureInExtensionDir, readJsonFile, writeJsonFile } from '../../extension/data';
import msg from '../../user_messages';

export const description = 'Unlink working directory extension from mobile environment';
export const command = 'unlink';
export async function handler() {
  const clientExtPath = path.join(ensureInExtensionDir(), 'app');
  const config = await readJsonFile(await mobileAppConfigPath());

  const extensionDirIndex = config.workingDirectories.indexOf(clientExtPath);

  if (extensionDirIndex < 0) {
    console.log(msg.unlink.notLinked());
    return;
  }

  config.workingDirectories.splice(extensionDirIndex, 1);

  await writeJsonFile(config, await mobileAppConfigPath());
  console.log(msg.unlink.complete());
}
