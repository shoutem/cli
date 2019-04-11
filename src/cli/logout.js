import logout from '../commands/logout';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Erase all locally stored credentials.';
export const command = 'logout';

export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}

export const handler = () => executeAndHandleError(logout);
