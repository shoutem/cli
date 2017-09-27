import _ from 'lodash';
import inquirer from 'inquirer';
import getOrSet from 'lodash-get-or-set';
import msg from '.././user_messages';

export async function promptShortcutInfo(shortcutName) {
  console.log('Enter shortcut information:');
  const { title }  = await inquirer.prompt({
    message: 'Title',
    name: 'title',
    type: 'input',
    default: _.upperFirst(shortcutName),
    validate: input => input.length > 0
  });
  console.log();
  return { title, name: shortcutName };
}

//throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
export function containsShortcut(extJson, shortcutName) {
  const names = (extJson.shortcuts || []).map(s => s.name);
  return _.includes(names, shortcutName);
}

export function addShortcut(extJson, shortcut) {
  extJson.shortcuts = extJson.shortcuts || [];
  extJson.shortcuts.push(shortcut);
  return extJson;
}

export function addShortcutForTemplate(
  extJson,
  { shortcutName, shortcutTitle, shortcutDescription, shortcutSelection, screenName, pageName }) {
  if (!shortcutName) {
    return null;
  }

  const shortcuts = getOrSet(extJson, 'shortcuts', []);
  let shortcut = _.find(shortcuts, { name: shortcutName });
  if (shortcut && shortcutSelection === 'new shortcut') {
    throw new Error(msg.shortcut.add.alreadyExists(shortcutName));
  }
  if (!shortcut) {
    shortcut = {
      name: shortcutName,
      title: shortcutTitle,
      description: shortcutDescription,
    };
    shortcuts.push(shortcut);
  }
  if (screenName) {
    shortcut.screen = `@.${screenName}`;
  }
  if (pageName) {
    shortcut.page = ``;
  }
  return shortcut;
}
