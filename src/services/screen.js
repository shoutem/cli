import _ from "lodash";
import { prompt } from "inquirer";
import {isVariableName} from "./cli-parsing";
import {askPageCreationQuestions} from './page';
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

function createScreenCreationQuestions({ screens, parentName }) {
  return {
    type: 'input',
    name: 'name',
    message: 'Screen name:',
    validate: name => validateScreenName(name, screens),
    default: parentName ? `${parentName}Screen` : 'MyScreen',
  };
}

function createPageLinkingQuestions({ pages }) {
  const choices = [{
    name: 'a settings page I want to create right now',
    value: 'newPage',
  }, {
    name: 'decide later',
    value: 'skip'
  }, {
    name: 'an existing settings page',
    value: 'existingPage',
  }];

  if (!_.size(pages)) {
    choices.pop();
  }

  return {
    type: 'list',
    name: 'type',
    message: 'Which settings page should be used by this screen?',
    choices,
  }
}

function createPageSelectionQuestions({ pages }) {
  return {
    type: 'list',
    name: 'existingScreen',
    message: 'Select existing page:',
    choices: _.map(pages, 'name'),
  };
}

export async function askScreenCreationQuestions({ skipPage, ...opts }) {
  const screen = await prompt(createScreenCreationQuestions(opts));
  const parentName = screen.name;

  if (!skipPage) {
    const scope = await prompt(createPageLinkingQuestions(opts));

    if (scope.type === 'newPage') {
      screen.newPage = await askPageCreationQuestions({...opts, skipScope: true, parentName});
    }

    if (scope.type === 'existingPage') {
      screen.existingPageName = await prompt(createPageSelectionQuestions(opts));
    }
  }

  const message = "Shortcut is required for a screen to appear in the app. Create one now?";
  const { shouldCreateShortcut, ...shortcut } = await askShortcutCreationQuestions({ ...opts, parentName, message });
  if (shouldCreateShortcut) {
    screen.newShortcut = shortcut;
  }

  return screen;
}
