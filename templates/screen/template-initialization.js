import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';
import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";
import {addShortcutForTemplate} from "../../src/services/shortcut";

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

  addShortcutForTemplate(extJson, { shortcutName, shortcutTitle, shortcutDescription, shortcutSelection, screenName });
  await saveExtensionJson(extJson);
}

export async function after(localTemplatePath, destinationPath, { screenName }) {
  return { path: `app/screens/${screenName}.js`};
}
