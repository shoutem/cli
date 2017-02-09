/* eslint no-console: 0 */
import { handleError } from '../extension/error-handler';
import { pushAll } from '../commands/push-all';

export const description = 'Upload all extensions from the current directory';
export const command = 'push-all';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push extensions without building them. Use this option carefully!'
  },
  noconfirm: {
    type: 'boolean',
    description: 'Push extensions without asking for confirmation'
  }
};
export async function handler(args) {
  try {
    await pushAll(args);
  } catch (err) {
    await handleError(err);
  }
}
