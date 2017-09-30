import _ from 'lodash';
import decamelize from 'decamelize';
import { prompt } from 'inquirer';
import getOrSet from 'lodash-get-or-set';
import {isVariableName} from "./cli-parsing";

export async function promptShortcutInfo(shortcutName) {
  console.log('Enter shortcut information:');
  const { title }  = await prompt({
    message: 'Title',
    name: 'title',
    type: 'input',
    default: _.upperFirst(shortcutName),
    validate: input => input.length > 0
  });
  console.log();
  return { title, name: shortcutName };
}

export function containsShortcut(extJson, shortcutName) {
  const names = (extJson.shortcuts || []).map(s => s.name);
  return _.includes(names, shortcutName);
}

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

function createShortcutCreationQuestions({ shortcuts, parentName, pages, screens }) {
  const when = ({ shouldCreateShortcut }) => shouldCreateShortcut || !parentName;
  const screensNames = _.map(screens, 'name');
  const pagesNames = _.map(pages, 'name');

  return [{
    type: 'confirm',
    name: 'shouldCreateShortcut',
    message: 'Create a shortcut (so that screen can be added through the Builder)?',
    when: () => parentName,
  }, {
    type: 'input',
    name: 'name',
    message: 'Name for the new shortcut:',
    default: () => parentName || 'MyShortcut',
    validate: name => validateShortcutName(name, shortcuts),
    when,
  }, {
    type: 'input',
    name: 'title',
    message: 'Shortcut title:',
    validate: x => !!x,
    default: ({ name }) => decamelize(name, ' '),
    when,
  }, {
    type: 'input',
    name: 'description',
    message: 'Shortcut description:',
    validate: x => !!x,
    default: () => parentName ? `A shortcut for ${parentName}` : null,
    when,
  }, {
    type: 'checkbox',
    name: 'pagesNames',
    message: 'Which settings pages would you like to connect with this shortcut?',
    when: () => !parentName && screensNames.length,
    choices: screensNames,
  }, {
    type: 'list',
    name: 'screenName',
    message: 'Which screen would you like to connect with this shortcut?',
    when: () => !parentName && pagesNames.length,
    choices: [{ name: 'Skip this step', value: null }, ...pagesNames],
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
    name: `@.${page.name}`,
    title: page.title || decamelize(page.name, ' '),
  });
}
