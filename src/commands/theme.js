import _ from 'lodash';
import inquirer from 'inquirer';
import request from 'request-promise';
import { ensureInExtensionDir } from '../services/extension';
import {instantiateExtensionTemplate} from "../services/extension-template";

const themeUrls = {
  theme: 'https://raw.githubusercontent.com/shoutem/extensions/master/shoutem-rubicon-theme/app/themes/Rubicon.js',
  variables: 'https://raw.githubusercontent.com/shoutem/extensions/master/shoutem-rubicon-theme/server/primeThemeVariables.json'
};

async function promptThemeDetails(themeName) {
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

async function getThemeVariablesContent(themeName) {
  const templateJson = await request({ url: themeUrls.variables, json: true });
  templateJson.title = themeName;

  return JSON.stringify(templateJson, null, 2);
}

export async function createTheme(themeName) {
  const { title, description } = await promptThemeDetails(_.upperFirst(_.camelCase(themeName)));

  return await instantiateExtensionTemplate('theme', {
    extensionPath: ensureInExtensionDir(),
    title,
    themeName,
    description,
    themeContent: await request(themeUrls.theme),
    themeVariablesContent: await getThemeVariablesContent(themeName)
  });
}
