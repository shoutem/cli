/* eslint no-console: "off" */
import 'babel-polyfill';
import path from 'path';
import { mobileAppConfigPath } from '../../clients/cli-paths';
import { ensureInExtensionDir, readJsonFile, writeJsonFile } from '../../extension/data';
import msg from '../../user_messages';

export const description = 'Link working directory extension with mobile environment';
export const command = 'link';
export async function handler() {
  const clientExtPath = path.join(ensureInExtensionDir(), 'app');
  const config = await readJsonFile(await mobileAppConfigPath());

  if (config.workingDirectories.indexOf(clientExtPath) >= 0) {
    console.log(msg.link.alreadyLinked());
    return;
  }

  config.workingDirectories.push(clientExtPath);

  await writeJsonFile(config, await mobileAppConfigPath());
  console.log(msg.link.complete());
}
