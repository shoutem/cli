import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from "../../services/extension";
import {askScreenCreationQuestions} from "../../services/screen";
import {instantiateExtensionTemplate} from "../../services/extension-template";
import {offerChanges} from "../../services/diff";

export const description = 'Add a screen for applications running this extension';
export const command = 'add [name]';

export async function createScreen(opts, extensionPath) {
  await offerChanges(await instantiateExtensionTemplate('screen', { ...opts, extensionPath }));
  console.log('Success'.green.bold);
}

async function addScreen(args) {
  const extJson = loadExtensionJson();
  const answers = await askScreenCreationQuestions({ ...extJson, defaultName: args.name });
  
  return createScreen(answers, ensureInExtensionDir());
}

export const handler = args => executeAndHandleError(addScreen, args);
