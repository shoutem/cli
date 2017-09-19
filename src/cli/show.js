import show from '../commands/show.js';
import { executeAndHandleError } from '../services/error-handler';

export const command = 'show';
export const description = 'Shows user status and list of linked extensions';
export async function handler() {
  await executeAndHandleError(show);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
