/* eslint no-console: 0 */
import fs from 'mz/fs';
import path from 'path';
import _ from 'lodash';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp-promise';
import request from 'request-promise';
import {
  loadExtensionJsonAsync,
  saveExtensionJsonAsync,
  ensureInExtensionDir,
} from '../extension/data';
import { load } from '../extension/template';
import msg from '../user_messages';

const themeUrls = {
  theme: 'https://raw.githubusercontent.com/shoutem/extensions/master/shoutem-rubicon-theme/server/themeVariables.json',
  variables: 'https://raw.githubusercontent.com/shoutem/extensions/master/shoutem-rubicon-theme/server/themeVariables.json'
};


export async function promptThemeDetails(themeName) {
  console.log('Enter theme information.');
  const questions = [{
    message: 'Title',
    name: 'title',
    default: themeName,
    type: 'input',
  }, {
    message: 'Description',
    name: 'description',
    type: 'input',
  }];

  return await inquirer.prompt(questions)
}

export async function exportThemeInIndexJs(themeName) {
  const rootDir = ensureInExtensionDir();
  const indexJsPath = path.join(rootDir, 'app', 'index.js');
  const indexJsContent = await fs.readFile(indexJsPath, 'utf8');

  const template = load('./theme/app-index.js.template', { themeName });
  const newContent = `${indexJsContent}\n${template}\n`;
  await fs.writeFile(indexJsPath, newContent, 'utf8');
}

export async function createThemeFile(themeName) {
  const rootDir = ensureInExtensionDir();
  const themeDir = path.join(rootDir, 'app', 'themes');

  const themeFile = path.join(themeDir, `${themeName}.js`);
  await mkdirp(themeDir);
  const template = await request(themeUrls.theme);
  await fs.writeFile(themeFile, template, 'utf8');

  return path.relative(rootDir, themeFile);
}

export async function createVariablesFile(themeName) {
  const rootDir = ensureInExtensionDir();
  const themeVarsDir = path.join(rootDir, 'server', 'themes');
  const themeVarsFile = path.join(themeVarsDir, `${themeName}Variables.json`);
  await mkdirp(themeVarsDir);
  const template = await request(themeUrls.variables);
  await fs.writeFile(themeVarsFile, template, 'utf8');
  return path.relative(rootDir, themeVarsFile);
}

export async function createTheme(name) {
  const themeName = _.upperFirst(_.camelCase(name));

  const extJson = await loadExtensionJsonAsync();
  const names = _.get(extJson, 'themes', []).map(s => s.name);
  if (_.includes(names, themeName)) {
    throw new Error(msg.theme.add.alreadyExists(themeName));
  } else {
    const theme = await promptThemeDetails(themeName);
    theme.name = themeName;
    theme.showcase = [];
    theme.variables = `@.${themeName}Variables`;

    // Add theme to array of themes.
    extJson.themes = extJson.themes || [];
    extJson.themes.push(theme);

    // Add theme variables.
    const vars = {
      name: `${themeName}Variables`,
      path: `./server/themes/${themeName}Variables.json`,
    };
    extJson.themeVariables = extJson.themeVariables || [];
    extJson.themeVariables.push(vars);

    await saveExtensionJsonAsync(extJson);
    await exportThemeInIndexJs(themeName);
    const themeFilePath = await createThemeFile(themeName);
    const themeVarsPath = await createVariablesFile(themeName);
    return [themeFilePath, themeVarsPath];
  }
}
