import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from "../../services/extension";
import {askScreenCreationQuestions} from "../../services/screen";
import {instantiateExtensionTemplate} from "../../services/extension-template";
import {offerChanges} from "../../services/diff";

export const description = 'Add a screen for applications running this extension';
export const command = 'add';

export const handler = () => executeAndHandleError(async () => {
  const extJson = await loadExtensionJson();
  const answers = await askScreenCreationQuestions({ ...extJson, skipPage: true });
  await createScreen(answers, ensureInExtensionDir());
});

export async function createScreen(opts, extensionPath) {
  await offerChanges(await instantiateExtensionTemplate('screen', { ...opts, extensionPath }));
  console.log('Screen added!'.green.bold);
}
