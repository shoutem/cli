import * as shortcut from '../services/shortcut';
import { loadExtensionJson, saveExtensionJson } from '../services/extension';
import msg from '../user_messages';

export async function createShortcut(shortcutName) {
  const extJson = await loadExtensionJson();
  if (shortcut.containsShortcut(extJson, shortcutName)) {
    throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
  }

  const shortcutData = await shortcut.promptShortcutInfo(shortcutName);

  shortcut.addShortcut(extJson, shortcutData);
  await saveExtensionJson(extJson);
}

export async function createShortcutForScreen(shortcutData, screenName) {
  const shortcutName = shortcutData.name;

  const extJson = await loadExtensionJson();
  if (shortcut.containsShortcut(extJson, shortcutName)) {
    throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
  }

  shortcutData.screen = `@.${screenName}`;
  shortcut.addShortcut(extJson, shortcutData);
  await saveExtensionJson(extJson);
}
