/* eslint no-console: 0 */
import msg from '../user_messages';
import { logout } from '../commands/logout';
import { handleError } from '../extension/error-handler';

export const description = 'Erase all locally stored credentials.';
export const command = 'logout';
export function handler() {
  logout()
    .then(() => console.log(msg.logout.complete()))
    .catch(handleError);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
