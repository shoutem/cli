import { executeAndHandleError } from '../../services/error-handler';
import { askShortcutCreationQuestions } from '../../services/shortcut';
import { ensureInExtensionDir, loadExtensionJson } from '../../services/extension';
import instantiateExtensionTemplate from '../../services/extension-template';
import { offerChanges } from '../../services/diff';

export const description = 'Adds a new app shortcut to the extension.';
export const command = 'add [name]';

export async function createShortcut(answers, extensionPath) {
  await offerChanges(await instantiateExtensionTemplate('shortcut', { ...answers, extensionPath }));
  console.log('Success!'.bold.green);
}

export const handler = args => executeAndHandleError(async () => {
  const extJson = await loadExtensionJson();
  const answers = await askShortcutCreationQuestions({ ...extJson, defaultName: args.name });
  await createShortcut(answers, ensureInExtensionDir());
});
