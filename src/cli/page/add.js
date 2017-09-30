import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from '../../services/extension';
import {askPageCreationQuestions} from "../../services/page";
import {instantiateExtensionTemplate} from "../../services/extension-template";
import {offerChanges} from "../../services/diff";

export const description = 'Add a settings page to current extension';
export const command = 'add';

export const handler = args => executeAndHandleError(async () => {
  const answers = await askPageCreationQuestions(await loadExtensionJson());
  await createPage(answers, ensureInExtensionDir());
});

export async function createPage(opts, extensionPath) {
  const changes = await instantiateExtensionTemplate('settings-page', { ...opts, extensionPath });
  console.log(changes.postRunActions);
  await offerChanges(changes);
  console.log('Page added!'.green.bold);
}
