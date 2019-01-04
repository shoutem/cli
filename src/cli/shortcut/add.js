import {executeAndHandleError} from '../../services/error-handler';
import {askShortcutCreationQuestions} from "../../services/shortcut";
import {ensureInExtensionDir, loadExtensionJson} from "../../services/extension";
import {instantiateExtensionTemplate} from "../../services/extension-template";
import {offerChanges} from "../../services/diff";

export const description = 'Add an application shortcut';
export const command = 'add [name]';

export const handler = args => executeAndHandleError(async () => {
  const extJson = loadExtensionJson();
  const answers = await askShortcutCreationQuestions({ ...extJson, defaultName: args.name });
  await createShortcut(answers, ensureInExtensionDir());
});

export async function createShortcut(answers, extensionPath) {
  await offerChanges(await instantiateExtensionTemplate('shortcut', { ...answers, extensionPath }));
  console.log('Success!'.bold.green);
}
