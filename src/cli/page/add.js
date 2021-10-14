import { ensureUserIsLoggedIn } from '../../commands/login';
import { executeAndHandleError } from '../../services/error-handler';
import {
  ensureInExtensionDir,
  loadExtensionJson,
} from '../../services/extension';
import { askPageCreationQuestions } from '../../services/page';
import { instantiateExtensionTemplate } from '../../services/extension-template';
import { offerChanges } from '../../services/diff';

export const description = 'Adds a settings page to the current extension.';
export const command = 'add [name]';

export async function createPage(opts, extensionPath) {
  const developer = await ensureUserIsLoggedIn();
  const changes = await instantiateExtensionTemplate('settings-page', {
    ...opts,
    extensionPath,
    developer,
  });
  await offerChanges(changes);
  console.log('Success'.green.bold);
  console.log(
    "Remember to create 'server/translations/en.json' and add your translation strings to it.\nYou can use 'server/translations/example.json' to check the format.",
  );
}

export const handler = args =>
  executeAndHandleError(async () => {
    const extJson = await loadExtensionJson();
    const answers = await askPageCreationQuestions({
      ...extJson,
      defaultName: args.name,
    });
    await createPage(answers, ensureInExtensionDir());
  });
