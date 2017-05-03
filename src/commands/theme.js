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
  writeJsonFile
} from '../extension/data';
import { generateExtensionJs } from '../extension/ext-js-generator';
import msg from '../user_messages';

const themeUrls = {
  theme: 'https://raw.githubusercontent.com/shoutem/extensions/master/shoutem-rubicon-theme/app/themes/Rubicon.js',
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

  const templateJson = await request({ url: themeUrls.variables, json: true });
  templateJson.title = themeName;
  await writeJsonFile(templateJson, themeVarsFile);

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
    const themeFilePath = await createThemeFile(themeName);
    const themeVarsPath = await createVariablesFile(themeName);
    await generateExtensionJs(loadExtensionJsonAsync());
    return [themeFilePath, themeVarsPath];
  }
}
