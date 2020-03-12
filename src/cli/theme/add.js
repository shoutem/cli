import { createTheme } from '../../commands/theme';
import { handleError } from '../../services/error-handler';
import { ensureVariableName } from '../../services/cli-parsing';

export const description = 'Add a theme to the current extension';
export const command = 'add <name>';
export async function handler(args) {
  try {
    ensureVariableName(args.name);
    await createTheme(args.name);
  } catch (error) {
    await handleError(error);
  }
}
