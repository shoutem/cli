import _ from 'lodash';
import {isVariableName} from "./cli-parsing";
const decamelize = require("decamelize");
const inquirer = require("inquirer");
import getOrSet from 'lodash-get-or-set';
import {askScreenCreationQuestions} from "./screen";

export const createPageQuestions = ({ screens } = {}) => {
  const scopeChoices = [{
    name: 'new screen',
    value: 'new',
  }, {
    name: 'extension',
    value: 'extension',
  }, {
    name: 'decide later',
    value: 'skip',
  }, {
    name: 'existing screen',
    value: 'existing',
  }];

  const screensNames = _.map(screens, 'name');
  if (!_.size(screensNames)) {
    scopeChoices.pop();
  }

  return [{
    type: 'list',
    name: 'type',
    choices: ['react', 'html', 'blank'],
    default: 'react',
    message: 'Page type:',
  }, {
    type: 'input',
    name: 'name',
    message: 'Page name:',
    validate: name => isVariableName(name) || 'Settings page\'s name must be a valid js variable name',
    default: 'MyPage',
  }, {
    type: 'input',
    name: 'title',
    default: ({ name }) => decamelize(name, ' '),
    message: 'Settings page title:',
  }, {
    type: 'list',
    name: 'scope',
    message: 'This settings page controls settings for:',
    choices: scopeChoices,
  }, {
    type: 'list',
    name: 'existingScreen',
    message: 'This page should be used by:',
    when: ({ scope }) => scope === 'existing',
    choices: screensNames,
  }];
};

export async function askPageCreationQuestions(opts) {
  const pageData = await inquirer.prompt(createPageQuestions(opts));
  if (!pageData.existingScreen) {
    pageData.newScreen = await askScreenCreationQuestions({ skipPages: true });
  }
  return pageData;
}

export function addPageToExtJson(extJson, page) {
  const pages = getOrSet(extJson, 'pages', []);
  const page = _.find(pages, { name: page.name });
}
