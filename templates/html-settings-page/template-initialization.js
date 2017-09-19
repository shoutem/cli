import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';
import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";

function isHtmlPage({ type, path }) {
   return type === 'html' && !_.includes(path, 'server/build');
}

export async function before(templatePath, extensionPath, { pageName, pageTitle, shortcutName, scope }) {
  const extJson = await loadExtensionJson(extensionPath);
  const pages = getOrSet(extJson, 'pages', []);

  if (!_.every(pages, isHtmlPage)) {
    throw new Error("Html pages can't be mixed with non-html settings pages");
  }

  if (_.find(pages, { name: pageName })) {
    throw new Error(`Page ${pageName} already exists`);
  }

  pages.push({
    name: pageName,
    path: `server/pages/${pageName}/index.html`,
    type: 'html'
  });

  connectSettingsPage(extJson, { pageName, pageTitle, shortcutName, scope });
  await saveExtensionJson(extJson, extensionPath);
}

export async function after(templatePath, extensionPath, { pageName }) {
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
    getOrSet(shortcut, 'adminPages', []).push(pageReference);
  }
  if (scope === 'extension') {
    getOrSet(extJson, 'settingsPages', []).push(pageReference);
  }
}
