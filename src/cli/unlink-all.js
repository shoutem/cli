/* eslint no-console: "off" */
import { mobileAppConfigPath } from '../clients/cli-paths';
import { readJsonFile, writeJsonFile } from '../extension/data';
import msg from '../user_messages';

export const description = 'Unlink all directories from mobile environment';
export const command = 'unlink-all';
export async function handler() {
  const config = await readJsonFile(await mobileAppConfigPath()) || {};
  config.workingDirectories  = [];
  await writeJsonFile(config, await mobileAppConfigPath());
  console.log(msg.unlink.all.complete());
}
