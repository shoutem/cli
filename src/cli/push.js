/* eslint no-console: 0 */
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';

export const description = 'Upload local extension code and assets.';
export const command = 'push';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push the extension without building it. Use this option carefully!'
  }
};

export async function handler(args) {
  try {
      await uploadExtension(args);
      console.log(msg.push.complete());
  } catch (err) {
    await handleError(err);
  }
}
