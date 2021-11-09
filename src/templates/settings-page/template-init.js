import getOrSet from 'lodash-get-or-set';
import { instantiateExtensionTemplate } from '../../services/extension-template';
import { linkSettingsPageWithExistingScreen } from '../../services/shortcut';

export async function after(context) {
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
