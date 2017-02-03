/* eslint no-console: "off" */
import 'babel-polyfill';
import path from 'path';
import { mobileAppConfigPath } from '../clients/cli-paths';
import { getExtensionRootDir, readJsonFile, writeJsonFile } from '../extension/data';
import msg from '../user_messages';

export const description = 'Link working directory extension with mobile environment';
export const command = 'link';
export const builder = {
  force: {
    type: 'boolean',
    description: 'Link current directory even if it\'s not an extension directory'
  }
};

export async function handler(args) {
  const config = await readJsonFile(await mobileAppConfigPath()) || {};
  config.workingDirectories = config.workingDirectories || [];

  const extensionDir = getExtensionRootDir();
  if (!extensionDir && !args.force) {
    console.log('Not an extension directory. Use `shoutem link --force` to link an arbitrary directory.');
    return null;
  }

  const workingDir = extensionDir ? path.join(extensionDir, 'app') : process.cwd();

  if (config.workingDirectories.indexOf(workingDir) >= 0) {
    console.log(msg.link.alreadyLinked());
    return null;
  }

  config.workingDirectories.push(workingDir);

  await writeJsonFile(config, await mobileAppConfigPath());
  console.log(msg.link.complete());
}
