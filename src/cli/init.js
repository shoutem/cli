import msg from '../user_messages';
import { isValidExtensionName } from '../services/validation'
import { initExtension } from '../commands/init';
import { handleError } from '../services/error-handler';
import { validateArgumentCount } from '../services/cli-parsing';

export const command = 'init <name>';
export const description = 'Create a scaffold of all files and folders required to build an extension.';
export async function handler(args) {
  const name = args.name;
  try {
    if (!isValidExtensionName(name)) {
      throw new Error(msg.init.invalidName(name));
    }
    validateArgumentCount(args, 0);
    await initExtension(name);
    console.log(msg.init.complete())
  } catch (err) {
    await handleError(err);
  }
}
export const builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`).strict();
};
