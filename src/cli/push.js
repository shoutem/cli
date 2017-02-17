/* eslint no-console: 0 */
import { pushAll } from '../commands/push-all';
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';
import multiglob from '../extension/multiglob';

export const description = 'Upload local extension code and assets.';
export const command = 'push [paths..]';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push the extension without building it. Use this option carefully!'
  },
  noconfirm: {
    type: 'boolean',
    description: 'Push extensions without asking for confirmation'
  },
  without: {
    type: 'array',
    description: 'Directory to skip. Can be passed multiple times for skipping multiple directories. Used only if multiple extensions are pushed.',
    requiresArg: true,
  }
};

export async function handler(args) {
  try {
    if (args.paths.length === 0) {
      await uploadExtension(args);
      console.log(msg.push.complete());
    } else {
      args.paths = multiglob(args.paths);
      await pushAll(args);
    }
  } catch (err) {
    await handleError(err);
  }
}
