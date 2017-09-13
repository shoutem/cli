import _ from 'lodash';
import { loadExtensionJson, saveExtensionJson } from '../../src/services/data';
import { generateExtensionJs } from '../../src/services/ext-js-generator';

module.exports = async function (localTemplatePath, extensionPath, { title, themeName, description }) {
  const extJson = await loadExtensionJson(extensionPath) || {};

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

  await saveExtensionJson(extJson);
  await generateExtensionJs(extensionPath);

  return [
    `app/themes/${themeName}.js`,
    `server/themes/${themeName}Variables.js`
  ];
};
