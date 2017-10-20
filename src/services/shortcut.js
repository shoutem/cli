import _ from 'lodash';
import decamelize from 'decamelize';
import { prompt } from 'inquirer';
import getOrSet from 'lodash-get-or-set';
import {isVariableName} from "./cli-parsing";

export function addShortcut(extJson, { name, title, description, screenName, pagesNames }) {
  const shortcut = { name, title, description };
  if (screenName) {
    shortcut.screen = `@.${screenName}`;
  }
  if (_.size(pagesNames)) {
    shortcut.adminPages = pagesNames.map(name => ({
      page: `@.${name}`,
      title: decamelize(name, ' '),
    }));
  }

  getOrSet(extJson, 'shortcuts', []).push(shortcut);
}

function validateShortcutName(name, existingShortcuts) {
  if (!isVariableName(name)) {
    return 'Shortcut\'s name must be a valid js variable name';
  }
  if (_.find(existingShortcuts, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createShortcutCreationQuestions({ shortcuts, parentName, screens, defaultName = 'MyShortcut' }) {
  const when = ({ shouldCreateShortcut }) => shouldCreateShortcut || !parentName;
  const shortcutsWithoutScreen = _.filter(screens, ({ name }) => !_.find(shortcuts, { screen: `@.${name}` }));
  const screensNames = _.map(shortcutsWithoutScreen, 'name');

  return [{
    type: 'confirm',
    name: 'shouldCreateShortcut',
    message: 'Create a shortcut (so that screen can be added through the Builder)?',
    when: () => parentName,
  }, {
    type: 'input',
    name: 'name',
    message: 'Shortcut name:',
    default: () => parentName || defaultName,
    validate: name => validateShortcutName(name, shortcuts),
    when,
  }, {
    type: 'input',
    name: 'title',
    message: 'Shortcut title:',
    validate: x => !!x,
    default: ({ name }) => _.upperFirst(decamelize(name, ' ')),
    when,
  }, {
    type: 'input',
    name: 'description',
    message: 'Shortcut description:',
    default: () => parentName ? `A shortcut for ${parentName}` : null,
    when,
  }, {
    type: 'list',
    name: 'screenName',
    message: 'Which screen would you like to connect with this shortcut?',
    when: () => !parentName && screensNames.length,
    choices: [{ name: 'skip', value: null }, ...screensNames],
  }];
}

export async function askShortcutCreationQuestions(opts) {
  return await prompt(createShortcutCreationQuestions(opts));
}

export function addShortcutForScreen(extJson, screen, shortcut) {
  getOrSet(extJson, 'shortcuts', [])
    .push({
      name: shortcut.name,
      title: shortcut.title,
      description: shortcut.description,
      screen: `@.${screen.name}`
    });
}

export function linkSettingsPageWithExistingScreen(extJson, page, screenName) {
  let shortcut = _.find(extJson.shortcuts, { screen: `@.${screenName}` });
  if (!shortcut) {
    throw new Error(`Shortcut for screen ${screenName} does not exist so it cannot be linked with settings pages. ` +
      `Please create a shortcut using 'shoutem shortcut add' first!`)
  }

  getOrSet(shortcut, 'adminPages', []).push({
    page: `@.${page.name}`,
    title: page.title || decamelize(page.name, ' '),
  });
}
