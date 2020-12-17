import _ from 'lodash';
import decamelize from 'decamelize';
import { prompt } from 'inquirer';
import { isVariableName } from './cli-parsing';
import { askScreenCreationQuestions } from './screen';

function validatePageName(name, existingPages) {
  if (!isVariableName(name)) {
    return 'Settings page\'s name must be a valid js variable name';
  }
  if (_.find(existingPages, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createPageCreationQuestions({ pages, parentName, defaultName = 'MyPage' }) {
  return [{
    type: 'list',
    name: 'type',
    choices: ['react', 'html'],
    default: 'react',
    message: 'Settings page type:',
  }, {
    type: 'input',
    name: 'name',
    message: 'Settings page name:',
    validate: name => validatePageName(name, pages),
    default: parentName ? `${parentName}Page` : defaultName,
  }, {
    type: 'input',
    name: 'title',
    default: ({ name }) => _.upperFirst(decamelize(name, ' ')),
    message: 'Settings page title:',
  }];
}

function createPageScopeQuestions({ screens, name: extensionName }) {
  return [{
    type: 'list',
    name: 'type',
    message: 'This settings page controls settings for:',
    choices: _.filter([{
      name: 'an existing screen',
      value: 'existingScreen',
      include: _.size(screens),
    }, {
      name: 'a new screen (creates a screen)',
      value: 'newScreen',
      include: true,
    }, {
      name: `the '${extensionName}' extension`,
      value: 'extension',
      include: true,
    }, {
      name: 'skip',
      value: 'skip',
      include: true,
    }], 'include'),
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

export async function askPageCreationQuestions(opts) {
  const page = await prompt(createPageCreationQuestions(opts));
  const parentName = page.name;

  const scope = await prompt(createPageScopeQuestions(opts));

  if (scope.type === 'existingScreen') {
    _.merge(page, await prompt(createScreenSelectionQuestions(opts)));
  }

  if (scope.type === 'newScreen') {
    page.newScreen = await askScreenCreationQuestions({ opts, parentName });
  }

  if (scope.type === 'extension') {
    page.extensionScope = true;
  }

  return page;
}
