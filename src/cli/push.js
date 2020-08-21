import confirmPush from '../commands/confirm-admin-action';
import { uploadExtension } from '../commands/push';
import pushAll from '../commands/push-all';
import { executeAndHandleError } from '../services/error-handler';
import multiglob from '../services/multiglob';
import msg from '../user_messages';

export const description = 'Upload local extension code and assets.';
export const command = 'push [paths..]';
export const builder = (yargs) => {
  yargs
    .options({
      nobuild: {
        type: 'boolean',
        description: 'Pushes the extension without building it. Use this option carefully!',
      },
      noconfirm: {
        type: 'boolean',
        description: 'Pushes extensions without asking for confirmation.',
      },
      without: {
        type: 'array',
        description: 'Specifies directory to skip. Can be passed multiple times for skipping multiple directories. Used only if multiple extensions are pushed.',
        requiresArg: true,
      },
      nocheck: {
        type: 'boolean',
        description: 'Pushes without checking for syntax errors.',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export const handler = args => executeAndHandleError(async () => {
  if (!await confirmPush('WARNING: You are about to push using the \'shoutem\' developer account. Are you sure about that?')) {
    console.log('Push aborted'.bold.yellow);
    return;
  }

  if (!args.paths.length) {
    await uploadExtension(args);
    console.log(msg.push.complete());
    return;
  }

  const resolvedArgs = {
    ...args,
    paths: multiglob(args.paths),
  };
  await pushAll(resolvedArgs);
});
