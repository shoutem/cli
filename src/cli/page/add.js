import _ from 'lodash';
import pascalize from 'uppercamelcase';
import decamelize from 'decamelize';
import inq from 'inquirer';
import msg from '../../user_messages';
import {ensureVariableName, isVariableName} from '../../services/cli-parsing';
import { executeAndHandleError } from '../../services/error-handler';
import * as yarn from '../../services/yarn';
import {ensureInExtensionDir, loadExtensionJson} from '../../services/extension';
import { instantiateTemplatePath } from '../../services/template';
import {generateExtensionJs} from "../../services/ext-js-generator";

export const description = 'Add a settings page to current extension';
export const command = 'add [name]';
export const builder = {
  type: {
    alias: 't',
    requiresArg: true,
    description: 'Type of settings page to create (react, html, blank).'
  },
  scope: {
    alias: 's',
    description: 'Where should the settings page be inserted (shortcut, extension).',
    requiresArg: true,
  },
  shortcut: {
    description: 'Name of the shortcut if settings page is to be connected with shortcut',
    requiresArg: true,
  },
  title: {
    description: 'Title of the settings page being created. Defaults to page name',
    requiresArg: true,
  }
};

const createQuestions = (args, shortcutNames) => [{
  type: 'list',
  name: 'type',
  choices: ['react', 'html', 'blank'],
  default: 'react',
  message: 'Page type:',
  when: () => !args.type
}, {
  type: 'input',
  name: 'name',
  message: 'Page name:',
  validate: name => isVariableName(name) || 'Settings page\'s name must be a valid js variable name',
  when: () => !args.name,
  default: 'MyPage'
}, {
  type: 'input',
  name: 'title',
  default: answers => decamelize(answers.name || args.name, ' '),
  message: 'Settings page title:',
  when: () => !args.title
}, {
  type: 'list',
  name: 'scope',
  choices: [...(shortcutNames.length ? ['shortcut'] : []), 'extension', 'none'],
  message: 'Select whether the page should be connected as a shortcut settings page or an extension settings page:',
  when: () => !args.scope
}, {
  type: 'list',
  name: 'shortcut',
  message: 'Shortcut this settings page should be used for:',
  when: answers => !args.shortcut && (args.scope || answers.scope) === 'shortcut',
  choices: shortcutNames
}];

export const handler = args => executeAndHandleError(async () => {
  const shortcutNames = _.map((await loadExtensionJson()).shortcuts, 'name');
  await createPage({ ...args, ...await inq.prompt(createQuestions(args, shortcutNames)) });
});

export async function createPage({ name: pageName, type, shortcut: shortcutName, scope, title }, extensionDir = ensureInExtensionDir()) {
  ensureVariableName(pageName);

  const pageDirectoryName = decamelize(pageName, '-');
  const pageClassName = pascalize(pageName);

  if (shortcutName && !scope) {
    scope = 'shortcut';
  }

  const templateVars = {
    pageDirectoryName,
    pageClassName,
    pageName,
    pageTitle: title,
    scope,
    shortcutName
  };

  if (type === 'html') {
    const { path } = await instantiateTemplatePath('html-settings-page', extensionDir, templateVars);
    console.log(msg.page.add.complete({ path, pageName }));
  }

  if (type === 'react') {
    await instantiateTemplatePath('react-settings-page', extensionDir, templateVars);
    await instantiateTemplatePath('react-settings-bin', extensionDir, {}, { overwrite: () => true });
    console.log(`React settings page added to pages/${pageDirectoryName}`);
  }

  if (type === 'blank') {
    await instantiateTemplatePath('blank-settings-page', extensionDir, templateVars);
    console.log(`Blank settings page added to pages/${pageDirectoryName}`);
  }

  await generateExtensionJs(extensionDir);
}
