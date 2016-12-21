/* eslint no-console: 0 */
import _ from 'lodash';
import async from 'async';
import inquirer from 'inquirer';

import { ensureDeveloperIsRegistered } from './register';
import {
  loadExtensionJson,
  saveExtensionJson,
} from '../extension/data';
import msg from '../user_messages';

export function promptShortcutDetails(shortcutName, callback) {
  console.log('Enter shortcut information.');
  const questions = [{
    message: 'Title',
    name: 'title',
    type: 'input',
    validate: input => input.length > 0
  }, {
    message: 'Description',
    name: 'description',
    type: 'input',
    validate: input => input.length >= 0
  }];

  inquirer.prompt(questions)
    .then(answers => callback(null, answers))
    .catch(callback);
}

export function createShortcut(shortcutName, callback) {
  let extension;

  async.waterfall([
    // This will call process.exit() if called outside of extension directory:
    loadExtensionJson,

    (extJson, done) => {
      extension = extJson;
      ensureDeveloperIsRegistered()
        .then(dev => done(null, dev))
        .catch(err => done(err));
    },

    (__, done) => {
      const names = _.get(extension, 'shortcuts', []).map(s => s.name);
      if (_.includes(names, shortcutName)) {
        done(new Error(msg.shortcut.add.alreadyExists(shortcutName)));
      } else {
        promptShortcutDetails(shortcutName, done);
      }
    },

    (shortcut, done) => {
      /* eslint no-param-reassign: 0 */
      shortcut.name = shortcutName;
      if (extension.shortcuts) extension.shortcuts.push(shortcut);
      else extension.shortcuts = [shortcut];
      saveExtensionJson(extension, done);
    },
  ],
    callback);
}
