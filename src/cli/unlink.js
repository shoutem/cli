/* eslint no-console: "off" */
import { handleError } from '../extension/error-handler';
import { getExtensionRootDir } from '../extension/data';
import { unlinkDirectory, setLinkedDirectories } from '../extension/linker';
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

    if (args.all) {
      await setLinkedDirectories([]);
    } else {
      await unlinkDirectory(getExtensionRootDir() || process.cwd());
    }

    console.log(msg.unlink.complete());
  } catch (exc) {
    await handleError(exc);
  }
}
