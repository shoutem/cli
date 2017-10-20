import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Log in and register as a Shoutem developer.';
export const command = 'login';
export const handler = args => executeAndHandleError(() => loginUser(args));
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
