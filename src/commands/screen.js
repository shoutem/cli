import { ensureInExtensionDir, loadExtensionJson } from '../services/extension';
import * as shortcut from '../services/shortcut';
import { ensureVariableName } from '../services/cli-parsing';
import msg from '../user_messages';
import { instantiateTemplatePath } from '../services/template';
import { createShortcutForScreen } from './shortcut';

export async function createScreen(screenName, shortcutName = null) {
  [screenName, shortcutName].map(ensureVariableName);
  const extJson = await loadExtensionJson();

  const shortcutData = shortcutName ? await shortcut.promptShortcutInfo(shortcutName) : null;

  if (shortcut.containsShortcut(extJson, shortcutName)) {
    throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
  }

  const { path } = await instantiateTemplatePath('screen', ensureInExtensionDir(), { screenName, screenClassName: screenName });
  console.log(msg.screen.add.complete(screenName, path));

  if (shortcutData) {
    await createShortcutForScreen(shortcutData, screenName);
    console.log(`Shortcut ${shortcutName} created.`);
    console.log(`Shortcut ${shortcutName} opens ${screenName} screen.`);
  }

  console.log('File `app/extension.js` was modified.');
  console.log('File `extension.json` was modified.');
}
