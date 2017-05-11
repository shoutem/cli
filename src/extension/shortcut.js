import { info } from './logger';
import _ from 'underscore';
import inquirer from 'inquirer';

export async function promptShortcutInfo(shortcutName) {
  const { title }  = await inquirer.prompt({
    message: 'Title',
    name: 'title',
    type: 'input',
    default: _.upperFirst(shortcutName),
    validate: input => input.length > 0
  });

  return { title, name: shortcutName };
}