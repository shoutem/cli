import msg from '../../user_messages';
import { createShortcut } from '../../commands/shortcut';
import { handleError } from '../../extension/error-handler';

export const description = 'Add an application shortcut';
export const command = 'add <name>';
export async function handler(args) {
  try {
    await createShortcut(args.name);
    console.log(msg.shortcut.add.complete(args.name));
    console.log('File `extension.json` was modified.');
  } catch (error) {
    await handleError(error);
  }
}
