import msg from '../user_messages';
import { isValidExtensionName } from '../extension/validation'
import { initExtension } from '../commands/init';
import { handleError } from '../extension/error-handler';

export const command = 'init <name>';
export const description = 'Create a scaffold of all files and folders required to build an extension.';
export async function handler(args) {
  const name = args.name;
  if (!isValidExtensionName(name)) {
    console.log(msg.init.invalidName(name));
    return null;
  }
  try {
    await initExtension(name);
    console.log(msg.init.complete())
  } catch (err) {
    await handleError(err);
  }
}
export const builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
};
