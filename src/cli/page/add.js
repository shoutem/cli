import _ from 'lodash';
import pascalize from 'uppercamelcase';
import decamelize from 'decamelize';
import inq from 'inquirer';
import msg from '../../user_messages';
import {ensureVariableName, isVariableName} from '../../services/cli-parsing';
import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from '../../services/extension';
import { instantiateTemplatePath } from '../../services/template';
import {generateExtensionJs} from "../../services/ext-js-generator";

export const description = 'Add a settings page to current extension';
export const command = 'add';

const createQuestions = (args, screenNames) => {
  const scopeChoices = ['new screen', 'extension', 'skip this step'];
  if (_.size(screenNames)) {
    scopeChoices.unshift('existing screen');
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
    default: answers => decamelize(answers.name || args.name, ' '),
    message: 'Settings page title:',
  }, {
    type: 'list',
    name: 'scope',
    message: 'This page should be referenced by:',
    choices: ['existing screen', 'new screen', 'extension', 'skip this step'],
  }, {
    type: 'list',
    name: 'screenName',
    message: 'Shortcut this settings page should be used for:',
    when: ({scope}) => scope === 'existing shortcut',
    choices: scopeChoices,
  }];
};

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
