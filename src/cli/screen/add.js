import _ from 'lodash';
import msg from '../../user_messages';
import { ensureInExtensionDir } from '../../extension/data';
import { instantiateTemplatePath } from '../../extension/template';
import { handleError } from '../../extension/error-handler';
import { createShortcut } from '../../commands/shortcut';
import { loadExtensionJsonAsync } from '../../extension/data';

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
    const extJson = await loadExtensionJsonAsync();
    extJson.shortcuts = extJson.shortcuts || [];
    if (shortcutName && _.includes(extJson.shortcuts.map(s => s.name), shortcutName)) {
        throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
    }
    const extensionDir = ensureInExtensionDir();
    const { path } = await instantiateTemplatePath('screen', extensionDir, { screenName, screenClassName: screenName });
    console.log(msg.screen.add.complete(screenName, path));

    if (!shortcutName) {
      return null;
    }

    await createShortcut(shortcutName, screenName);
    console.log('File `extension.json` was modified');
    console.log(msg.shortcut.add.complete(args.name));
  } catch (err) {
    await handleError(err);
  }
}
