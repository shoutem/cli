import { executeAndHandleError } from '../../services/error-handler';
import {ensureInExtensionDir, loadExtensionJson} from '../../services/extension';
import {askPageCreationQuestions} from "../../services/page";
import {instantiateExtensionTemplate} from "../../services/extension-template";

export const description = 'Add a settings page to current extension';
export const command = 'add';

export const handler = args => executeAndHandleError(async () => {
  const answers = await askPageCreationQuestions(await loadExtensionJson());
  await createPage(answers, ensureInExtensionDir());
});

export async function createPage(opts, extensionPath) {
  await instantiateExtensionTemplate('settings-page', { ...opts, extensionPath });
}
