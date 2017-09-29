import _ from 'lodash';
import decamelize from "decamelize";
import { prompt } from "inquirer";
import {isVariableName} from "./cli-parsing";
import { askScreenCreationQuestions } from "./screen";

function validatePageName(name, existingPages) {
  if (!isVariableName(name)) {
    return 'Settings page\'s name must be a valid js variable name';
  }
  if (_.find(existingPages, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createPageCreationQuestions({ pages, parentName }) {
  return [{
    type: 'list',
    name: 'type',
    choices: ['react', 'html', 'blank'],
    default: 'react',
    message: 'Settings page type:',
  }, {
    type: 'input',
    name: 'name',
    message: 'Settings page name:',
    validate: name => validatePageName(name, pages),
    default: parentName ? `${parentName}Page` : 'MyPage',
  }, {
    type: 'input',
    name: 'title',
    default: ({ name }) => decamelize(name, ' '),
    message: 'Settings page title:',
  }];
}

function createPageScopeQuestions({ screens, name: extensionName }) {
  const scopeChoices = [{
    name: 'a screen I want to create right now',
    value: 'newScreen',
  }, {
    name: `the entire '${extensionName}' extension`,
    value: 'extension',
  }, {
    name: 'decide later',
    value: 'skip',
  }, {
    name: 'an existing screen',
    value: 'existingScreen',
  }];
  if (!_.size(screens)) {
    scopeChoices.pop();
  }

  return [{
    type: 'list',
    name: 'type',
    message: 'This settings page controls settings for:',
    choices: scopeChoices,
  }];
}

function createScreenSelectionQuestions({ screens }) {
  return {
    type: 'list',
    name: 'existingScreenName',
    message: 'Select existing screen:',
    choices: _.map(screens, 'name'),
  };
}

export async function askPageCreationQuestions({ skipScope, ...opts }) {
  const page = await prompt(createPageCreationQuestions(opts));
  const parentName = page.name;

  if (skipScope) {
    return page;
  }

  const scope = await prompt(createPageScopeQuestions(opts));

  if (scope.type === 'existingScreen') {
    _.merge(page, await prompt(createScreenSelectionQuestions(opts)));
  }

  if (scope.type === 'newScreen') {
    page.newScreen = await askScreenCreationQuestions({ opts, skipPage: true, parentName });
  }

  if (scope.type === 'extension') {
    page.extensionScope = true;
  }

  return page;
}
