import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Log in and register as a Shoutem developer.\nProvide credentials in username:password format.';
export const command = 'login [credentials]';

export function builder(yargs) {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
}

export const handler = args => executeAndHandleError(loginUser, args);
