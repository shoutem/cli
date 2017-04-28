import { pushAll } from '../commands/push-all';
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';
import multiglob from '../extension/multiglob';
import confirmPush from '../commands/confirm-admin-action';

export const description = 'Upload local extension code and assets.';
export const command = 'push [paths..]';
export const builder = yargs => {
  return yargs
    .options({
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
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  if (!await confirmPush('WARNING: you are about tu push using shoutem developer. Are you sure about that?')) {
    console.log('Push aborted'.bold.yellow);
    return null;
  }

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
