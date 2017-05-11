import _ from 'lodash';
import { promptShortcutInfo } from '../extension/shortcut';
import { loadExtensionJsonAsync, saveExtensionJsonAsync } from '../extension/data';
import msg from '../user_messages';

export async function createShortcut(shortcutName, screenName = null) {
  const extJson = await loadExtensionJsonAsync();
  extJson.shortcuts = extJson.shortcuts || [];

  const names = extJson.shortcuts.map(s => s.name);
  if (_.includes(names, shortcutName)) {
    throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
  }
  console.log('Enter shortcut information.');
  const shortcut = await promptShortcutInfo(shortcutName);

  if (screenName) {
    shortcut.screen = `@.${screenName}`;
  }
  extJson.shortcuts.push(shortcut);

  await saveExtensionJsonAsync(extJson);
}
