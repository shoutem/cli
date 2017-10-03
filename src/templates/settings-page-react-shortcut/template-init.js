import {instantiateExtensionTemplate} from "../../services/extension-template";
import {linkSettingsPageWithExistingScreen} from "../../services/shortcut";

export async function after(context) {
  const { extJson, newScreen, existingScreenName } = context;

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
