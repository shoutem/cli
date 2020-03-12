import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Log in and register as a Shoutem developer.\nProvide credentials in username:password format.';
export const command = 'login [credentials]';

export function handler(args) {

  return executeAndHandleError(() => loginUser(args));
}

export function builder(yargs) {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
}
