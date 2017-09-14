import _ from 'lodash';
import {loadExtensionJson} from "../../src/services/extension";

function importStatements(names, path) {
  return names.map(name => `import ${name} from '${path}/${name}';`).join('\n');
}

function indentedNamesList(names) {
  return names.map(name => `  ${name}`).join(',\n');
}

function classFromPagePath(pagePath) {
  return pagePath.split('?page=').pop();
}

/**
 * Generate app/extension.js file within the extension.
 * This file is used to export extension's themes and screens.
 */
export async function before(templatePath, extensionPath, templateVars) {
  const extJson = await loadExtensionJson(extensionPath);

  const screensNamesList = _.map(extJson.screens, 'name');
  const screensImports = importStatements(screensNamesList, './screens');
  const screensNames = indentedNamesList(screensNamesList);

  const themesNamesList = _.map(extJson.themes, 'name');
  const themesImports = importStatements(themesNamesList, './themes');
  const themesNames = indentedNamesList(themesNamesList);

  const pagesNamesList = _.map(extJson.pages, 'paths').map(classFromPagePath);
  const pagesImports = importStatements(pagesNamesList, './pages/');
  const pagesNames = indentedNamesList(pagesNamesList);

  return {
    ...templateVars,
    screensImports,
    screensNames,
    themesImports,
    themesNames,
    pagesImports,
    pagesNames,
  };
}
