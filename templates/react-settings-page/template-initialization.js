import _ from 'lodash';
import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";
import {connectSettingsPage} from "../html-settings-page/template-initialization";
import {addShortcutForTemplate} from "../../src/services/shortcut";

function isReactPage({ type, path }) {
  return type === 'react-page' || _.includes(path, 'server/build');
}

export async function before(templatePath, extensionPath, {
  shortcutName,
  shortcutTitle,
  shortcutDescription,
  shortcutSelection,
  pageName
}) {
  const extJson = await loadExtensionJson(extensionPath);

  if (_.find(extJson.pages, { name: pageName })) {
    throw new Error(`Page ${pageName} already exists`);
  }

  if (!_.every(extJson.pages, isReactPage)) {
    throw new Error("React pages can't be mixed with non-react settings pages");
  }
  addShortcutForTemplate(extJson, { shortcutName, shortcutTitle, shortcutDescription, shortcutSelection, pageName });
}

export async function after(templatePath, extensionPath, { pageName, scope, shortcutName, pageTitle }) {
  const extJson = await loadExtensionJson(extensionPath);

  extJson.pages = extJson.pages || [];
  extJson.pages.push({
    name: pageName,
    type: 'react-page'
  });
  connectSettingsPage(extJson, { pageName, pageTitle, shortcutName, scope });

  await saveExtensionJson(extJson)
}
