import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';
import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";
import msg from "../../src/user_messages";

export async function before(localTemplatePath, destinationPath, {
  screenName,
  shortcutName,
  shortcutTitle,
  shortcutDescription,
  shortcutSelection,
}) {
  const extJson = await loadExtensionJson(destinationPath);

  const screens = getOrSet(extJson, 'screens', []);
  if (_.find(screens, { name: screenName })) {
    throw new Error(`Screen ${screenName} already exists`);
  }
  screens.push({ name: screenName });

  if (shortcutName) {
    const shortcuts = getOrSet(extJson, 'shortcuts', []);
    let shortcut = _.find(shortcuts, { name: shortcutName });
    if (shortcut && shortcutSelection === 'new shortcut') {
      throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
    }
    if (!shortcut) {
      shortcut = {
        name: shortcutName,
        title: shortcutTitle,
        description: shortcutDescription,
      };
      shortcuts.push(shortcut);
    }
    shortcut.screen = `@.${screenName}`;
  }

  await saveExtensionJson(extJson);
}

export async function after(localTemplatePath, destinationPath, { screenName }) {
  return { path: `app/screens/${screenName}.js`};
}
