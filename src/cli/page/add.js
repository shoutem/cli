import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from '../../services/extension';
import {askPageCreationQuestions} from "../../services/page";
import {instantiateExtensionTemplate} from "../../services/extension-template";
import {offerChanges} from "../../services/diff";

export const description = 'Add a settings page to current extension';
export const command = 'add [name]';

export async function createPage(opts, extensionPath) {
  const changes = await instantiateExtensionTemplate('settings-page', { ...opts, extensionPath });
  await offerChanges(changes);
  console.log('Success'.green.bold);
}

async function addPage(args) {
  const extJson = loadExtensionJson();
  const answers = await askPageCreationQuestions({ ...extJson, defaultName: args.name });

  return createPage(answers, ensureInExtensionDir());
}

export const handler = args => executeAndHandleError(addPage, args);
