/* eslint no-console: 0 */
import msg from '../user_messages';
import { ensureDeveloperIsRegistered } from '../commands/register';
import { handleError } from '../extension/error-handler';

export const description = 'Log in and register as a Shoutem developer.';
export const command = 'login';
export function handler() {
  ensureDeveloperIsRegistered()
    .then(dev => console.log(msg.login.complete(dev)))
    .catch(handleError);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
