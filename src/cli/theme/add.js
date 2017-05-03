import msg from '../../user_messages';
import { createTheme } from '../../commands/theme';
import { handleError } from '../../extension/error-handler';
import { ensureVariableName } from '../../extension/cli-parsing';

export const description = 'Add a theme to the current extension';
export const command = 'add <name>';
export async function handler(args) {
  try {
    ensureVariableName(args.name);
    const paths = await createTheme(args.name);
    paths.forEach(path => console.log(msg.theme.add.complete(args.name, path)));
  } catch (error) {
    await handleError(error);
  }
}
