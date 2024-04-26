const getOrSet = require('lodash-get-or-set');
const {
  instantiateExtensionTemplate,
} = require('../../services/extension-template');
const {
  linkSettingsPageWithExistingScreen,
} = require('../../services/shortcut');

async function after(context) {
  const {
    type,
    extensionScope,
    extJson,
    existingScreenName,
    newScreen,
    name,
    title,
  } = context;

  if (type === 'react') {
    await instantiateExtensionTemplate('settings-page-react', context);
  } else if (type === 'html') {
    await instantiateExtensionTemplate('settings-page-html', context);
  } else if (type === 'blank') {
    await instantiateExtensionTemplate('settings-page-blank', context);
  } else {
    throw new Error(`Invalid page type ${type}`);
  }

  if (extensionScope) {
    getOrSet(extJson, 'settingsPages', []).push({ page: `@.${name}`, title });

    return;
  }

  if (existingScreenName) {
    linkSettingsPageWithExistingScreen(extJson, context, existingScreenName);
  }

  if (newScreen) {
    await instantiateExtensionTemplate('screen', { ...context, ...newScreen });

    if (newScreen.newShortcut) {
      linkSettingsPageWithExistingScreen(extJson, context, newScreen.name);
    }
  }
}

module.exports = {
  after,
};
