import msg from '../user_messages';
import { clearTokens } from '../clients/auth-service';
import { handleError } from '../extension/error-handler';

export const description = 'Erase all locally stored credentials.';
export const command = 'logout';
export function handler() {
  clearTokens()
    .then(() => console.log(msg.logout.complete()))
    .catch(handleError);
}
export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
