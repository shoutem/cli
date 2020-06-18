import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Logs user in and registers as a Shoutem developer on first login with given credentials.\n You can provide credentials in username:password format to skip the interactive menu.';
export const command = 'login [credentials]';

export function handler(args) {

  return executeAndHandleError(() => loginUser(args));
}

export function builder(yargs) {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
}
