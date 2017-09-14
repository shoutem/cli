import {loadExtensionJson, saveExtensionJson} from "../../src/services/extension";
import {connectSettingsPage} from "../html-settings-page/template-initialization";

export async function after(templatePath, extensionPath, { pageClassName, pageName, scope, shortcutName, pageTitle }) {
  const extJson = await loadExtensionJson(extensionPath);

  extJson.pages = [
    ...(extJson.pages || []),
    {
      name: pageName,
      path: `server/build/index.html?page=${pageClassName}`,
      type: 'react-page'
    }
  ];

  connectSettingsPage(extJson, { pageName, pageTitle, shortcutName, scope });

  await saveExtensionJson(extJson)
}
