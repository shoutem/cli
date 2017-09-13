import msg from '../../user_messages';
import { createShortcut } from '../../commands/shortcut';
import { handleError } from '../../services/error-handler';
import { ensureVariableName } from '../../services/cli-parsing';

export const description = 'Add an application shortcut';
export const command = 'add <name>';
export async function handler(args) {
  try {
    ensureVariableName(args.name);
    await createShortcut(args.name);
    console.log(msg.shortcut.add.complete(args.name));
    console.log('File `extension.json` was modified.');
  } catch (error) {
    await handleError(error);
  }
}
