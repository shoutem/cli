import logout from '../commands/logout';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Erases all locally stored credentials.';
export const command = 'logout';
export async function handler() {
  await executeAndHandleError(logout);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
