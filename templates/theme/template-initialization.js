import _ from 'lodash';
import { loadExtensionJsonAsync, saveExtensionJsonAsync } from '../../src/extension/data';
import { generateExtensionJs } from '../../src/extension/ext-js-generator';

module.exports = async function (localTemplatePath, extensionPath, { title, themeName, description }) {
  const extJson = await loadExtensionJsonAsync(extensionPath) || {};

  const themes = extJson.themes = extJson.themes || [];
  if (_.includes(themes.map(theme => theme.name), themeName)) {
    throw new Error(`Theme \`${themeName}\` already exists. Pick another name.`);
  }
  themes.push({
    title,
    description,
    name: themeName,
    showcase: [],
    variables: `@.${themeName}Variables`,
  });

  const themeVariables = extJson.themeVariables = extJson.themeVariables || [];
  themeVariables.push({
    name: `${themeName}Variables`,
    path: `./server/themes/${themeName}Variables.json`,
  });

  await saveExtensionJsonAsync(extJson);
  await generateExtensionJs(extensionPath);

  return [
    `app/themes/${themeName}.js`,
    `server/themes/${themeName}Variables.js`
  ];
};
