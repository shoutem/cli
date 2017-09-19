import _ from 'lodash';
import decamelize from 'decamelize';
import { executeAndHandleError } from '../../services/error-handler';
import {ensureVariableName, isVariableName} from "../../services/cli-parsing";
import {ensureInExtensionDir, loadExtensionJson} from "../../services/extension";
import * as shortcut from "../../services/shortcut";
import msg from "../../user_messages";
import {instantiateTemplatePath} from "../../services/template";
import inq from 'inquirer';
import {generateExtensionJs} from "../../services/ext-js-generator";

export const description = 'Add a screen for applications running this extension';
export const command = 'add [name]';
export const builder = {
  shortcut: {
    alias: 's',
    requiresArg: true,
    description: 'adds a shortcut pointing to the screen being created'
  }
};

const createQuestions = (args, shortcutsNames) => ([{
  type: 'input',
  name: 'name',
  message: 'Screen name:',
  when: () => !args.name,
  validate: name => isVariableName(name) || 'Screen name must be a valid js variable name',
  default: 'MyScreen',
}, {
  type: 'list',
  name: 'shortcutSelection',
  message: 'Connect the screen with a new shortcut:',
  when: () => !args.shortcut,
  choices: ['new shortcut', ...(shortcutsNames.length ? ['existing shortcut'] : []), 'without shortcut']
}, {
  type: 'input',
  name: 'shortcut',
  message: 'Name for the new shortcut:',
  when: answers => answers.shortcutSelection === 'new shortcut',
  default: answers => (args.name || answers.name) + 'Shortcut',
  validate: name => isVariableName(name) || 'Shortcut name must be a valid js variable name',
}, {
  type: 'input',
  name: 'shortcutTitle',
  message: 'Shortcut title:',
  when: answers => answers.shortcutSelection === 'new shortcut',
  validate: title => !!title,
  default: answers => decamelize(answers.shortcut || args.shortcut, ' ')
}, {
  type: 'input',
  name: 'shortcutDescription',
  message: 'Shortcut description:',
  when: answers => answers.shortcutSelection === 'new shortcut',
  validate: desc => !!desc,
}, {
  type: 'list',
  name: 'shortcut',
  message: 'Select a shortcut:',
  when: answers => answers.shortcutSelection === 'existing shortcut',
  choices: shortcutsNames
}]);

export const handler = args => executeAndHandleError(async () => {
  if (args.shortcut) {
    args.shortcutSelection = 'new shortcut';
  }
  const shortcutsNames = _.map((await loadExtensionJson()).shortcuts, 'name');
  await createScreen({ ...args, ...await inq.prompt(createQuestions(args, shortcutsNames)) })
});

export async function createScreen({
   name: screenName,
   shortcut: shortcutName,
   shortcutTitle,
   shortcutDescription,
   shortcutSelection,
}) {
  [screenName, shortcutName].map(ensureVariableName);
  const extensionPath = ensureInExtensionDir();

  const { path } = await instantiateTemplatePath('screen', extensionPath, {
    screenName,
    screenClassName: screenName,
    shortcutName,
    shortcutTitle,
    shortcutDescription,
  });
  await generateExtensionJs(extensionPath);
  console.log(msg.screen.add.complete(screenName, path));

  if (shortcutSelection === 'new shortcut') {
    console.log(`Shortcut ${shortcutName} created.`);
    console.log(`Shortcut ${shortcutName} opens ${screenName} screen.`);
  }

  console.log('File `app/extension.js` was modified.');
  console.log('File `extension.json` was modified.');
}
