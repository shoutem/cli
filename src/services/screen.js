import _ from "lodash";
import { prompt } from "inquirer";
import {isVariableName} from "./cli-parsing";
import {askShortcutCreationQuestions} from "./shortcut";

function validateScreenName(name, existingScreens) {
  if (!isVariableName(name)) {
    return 'Screen\'s name must be a valid js variable name';
  }
  if (_.find(existingScreens, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createScreenCreationQuestions({ screens, parentName, defaultName = 'MyScreen' }) {
  return {
    type: 'input',
    name: 'name',
    message: 'Screen name:',
    validate: name => validateScreenName(name, screens),
    default: parentName ? `${parentName}Screen` : defaultName,
  };
}

export async function askScreenCreationQuestions(opts) {
  const screen = await prompt(createScreenCreationQuestions(opts));
  const parentName = screen.name;

  const message = "Shortcut is required for a screen to appear in the app. Create one now?";
  const { shouldCreateShortcut, ...shortcut } = await askShortcutCreationQuestions({ ...opts, parentName, message });
  if (shouldCreateShortcut) {
    screen.newShortcut = shortcut;
  }

  return screen;
}
