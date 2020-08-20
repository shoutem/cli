import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Handles Shoutem developer\'s authentication. Users already registered as Shoutem developers are simply logged in and non-developer users are first registered as developers and then logged in. Credentials can be provided in the username:password format as a command argument to skip the interactive menu.';
export const command = 'login [credentials]';

export function handler(args) {
  return executeAndHandleError(() => loginUser(args));
}

export function builder(yargs) {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
}
