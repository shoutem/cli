import _ from 'lodash';
import inquirer from 'inquirer';

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
