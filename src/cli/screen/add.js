import { executeAndHandleError } from '../../services/error-handler';
import {
  ensureInExtensionDir,
  loadExtensionJson,
} from '../../services/extension';
import { askScreenCreationQuestions } from '../../services/screen';
import { instantiateExtensionTemplate } from '../../services/extension-template';
import { offerChanges } from '../../services/diff';

export const description = 'Adds a screen for apps running this extension.';
export const command = 'add [name]';

export async function createScreen(opts, extensionPath) {
  await offerChanges(
    await instantiateExtensionTemplate('screen', { ...opts, extensionPath }),
  );
  console.log('Success'.green.bold);
}

export const handler = args =>
  executeAndHandleError(async () => {
    const extJson = await loadExtensionJson();
    const answers = await askScreenCreationQuestions({
      ...extJson,
      defaultName: args.name,
    });
    await createScreen(answers, ensureInExtensionDir());
  });
