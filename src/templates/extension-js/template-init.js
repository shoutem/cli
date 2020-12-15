import _ from 'lodash';
import decamelize from 'decamelize';
import {isReactPage} from '../settings-page-react/template-init';

function importStatements(names, path, directoriesNames = names) {
  return names.map((name, i) => `import ${name} from '${path}/${directoriesNames[i]}';`).join('\n');
}

function indentedNamesList(names) {
  return names.map(name => `  ${name}`).join(',\n');
}

/**
 * Generate app/extension.js file within the extension.
 * This file is used to export extension's themes and screens.
 */
export async function before(context) {
  const { extJson } = context;

  const screensNamesList = _.map(extJson.screens, 'name');
  const screensImports = importStatements(screensNamesList, './screens');
  const screensNames = indentedNamesList(screensNamesList);

  const themesNamesList = _.map(extJson.themes, 'name');
  const themesImports = importStatements(themesNamesList, './themes');
  const themesNames = indentedNamesList(themesNamesList);


  const pagesNamesList = _.map(_.filter(extJson.pages, isReactPage), 'name');
  const pagesDirectoriesList = pagesNamesList.map(name => decamelize(name, '-'));
  const pagesImports = importStatements(pagesNamesList, './pages', pagesDirectoriesList);
  const pagesNames = indentedNamesList(pagesNamesList);

  const extJsonString = JSON.stringify(extJson, null, 2);

  _.merge(context, {
    screensImports,
    screensNames,
    themesImports,
    themesNames,
    pagesImports,
    pagesNames,
    extJsonString,
  });
}
