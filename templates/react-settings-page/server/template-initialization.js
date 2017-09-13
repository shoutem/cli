
import {loadExtensionJson, saveExtensionJson} from "../../../src/extension/data";

module.exports = async (templatePath, extensionPath, { pageClassName, shortcutName }) => {
  const extJson = await loadExtensionJson(extensionPath);
  extJson.pages = [
    ...(extJson.pages || []),
    {
      name: shortcutName,
      path: `server/build/index.html?page=${pageClassName}`,
      type: 'html'
    }
  ];
  await saveExtensionJson(extJson)
};
