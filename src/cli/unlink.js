/* eslint no-console: "off" */
import path from 'path';
import { mobileAppConfigPath } from '../clients/cli-paths';
import { getExtensionRootDir, readJsonFile, writeJsonFile } from '../extension/data';
import { handleError } from '../extension/error-handler';
import { limitArguments } from '../extension/cli-parsing';
import msg from '../user_messages';

export const description = 'Unlink working directory extension from mobile environment';
export const command = 'unlink';

export const builder = yargs => {
  return yargs
    .options({
      all: {
        alias: 'a',
        description: 'unlink all linked directories',
        type: 'boolean'
      }
    });

};
export async function handler(args) {
  try {
    limitArguments(args, 0);
    const config = await readJsonFile(await mobileAppConfigPath()) || {};
    if (args.all) {
      config.workingDirectories = [];
    } else {
      const extensionDir = getExtensionRootDir();
      const workingDir = extensionDir ? path.join(extensionDir, 'app') : process.cwd();
      const extensionDirIndex = (config.workingDirectories || []).indexOf(workingDir);

      if (extensionDirIndex < 0) {
        console.log(msg.unlink.notLinked());
        return null;
      }

      config.workingDirectories.splice(extensionDirIndex, 1);
    }

    await writeJsonFile(config, await mobileAppConfigPath());
    console.log(msg.unlink.complete());
  } catch (exc) {
    await handleError(exc);
  }
}
