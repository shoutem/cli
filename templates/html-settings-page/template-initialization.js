import _ from 'lodash';
import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";

function isHtmlPage({ type, path }) {
   return type === 'html' && !_.includes(path, 'server/build');
}

export async function before(templatePath, extensionPath, { pageName }) {
  const extJson = await loadExtensionJson(extensionPath);
}

export async function after(templatePath, extensionPath, { pageName, pageTitle, shortcutName, scope }) {
  const extJson = await loadExtensionJson(extensionPath);
  extJson.pages = extJson.pages || [];
  extJson.pages.push({
    name: pageName,
    path: `server/pages/${pageName}/index.html`,
    type: 'html'
  });

  connectSettingsPage(extJson, { pageName, pageTitle, shortcutName, scope });

  await saveExtensionJson(extJson, extensionPath);
  return { path: `server/pages/${pageName}`};
}

export function connectSettingsPage(extJson, { pageName, pageTitle, shortcutName, scope }) {
  const pageReference = {
    page: `@.${pageName}`,
    title: pageTitle,
  };

  if (scope === 'shortcut') {
    const shortcut = _.find(extJson.shortcuts, { name: shortcutName });
    if (!shortcut) {
      throw new Error(`Shortcut ${shortcutName} does not exist`);
    }
    shortcut.adminPages = shortcut.adminPages || [];
    shortcut.adminPages.push(pageReference);
  }

  if (scope === 'extension') {
    extJson.settingsPages = extJson.settingsPages || [];
    extJson.settingsPages.push(pageReference);
  }
}
