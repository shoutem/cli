import { handleError } from '../../extension/error-handler';
import { createScreen } from '../../commands/screen';

export const description = 'Add a screen for applications running this extension';
export const command = 'add <name>';
export const builder = {
  shortcut: {
    alias: 's',
    requiresArg: true,
    description: 'adds a shortcut pointing to the screen being created'
  }
};
export async function handler(args) {
  const screenName = args.name;
  const shortcutName = args.shortcut;

  try {
    await createScreen(screenName, shortcutName);
  } catch (err) {
    await handleError(err);
  }
}
