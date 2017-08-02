import { loginUser } from '../commands/login';
import { executeAndHandleError } from '../extension/error-handler';

export const description = 'Log in and register as a Shoutem developer.';
export const command = 'login';
export function handler() {
  return executeAndHandleError(loginUser);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
