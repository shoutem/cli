import show from '../commands/show.js';
import { executeAndHandleError } from '../services/error-handler';

export const command = 'show';
export const description = 'Shows user status and list of linked extensions';
export const handler = args => executeAndHandleError(() => show(args));
export function builder(yargs) {
  return yargs
    .options({
      all: {
        type: 'boolean',
        default: false,
      }
    })
    .usage(`shoutem ${command}\n\n${description}`);
}
