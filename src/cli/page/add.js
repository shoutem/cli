import { createPage } from '../../commands/page';
import msg from '../../user_messages';
import { ensureVariableName } from '../../services/cli-parsing';
import { handleError } from '../../services/error-handler';

export const description = 'Add page to current extension';
export const command = 'add <name>';
export async function handler(args) {
  try {
    ensureVariableName(args.name);
    const result = await createPage(args.name);
    console.log(msg.page.add.complete(result));
  } catch (err) {
    await handleError(err);
  }
}
