import { pushAll } from '../commands/push-all';
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { executeAndHandleError } from '../services/error-handler';
import multiglob from '../services/multiglob';
import confirmPush from '../commands/confirm-admin-action';

export const description = 'Upload local extension code and assets.';
export const command = 'push [paths..]';
export const builder = yargs => {
  return yargs
    .options({
      nobuild: {
        type: 'boolean',
        description:
          'Pushes the extension without building it. Use this option carefully!',
      },
      noconfirm: {
        type: 'boolean',
        description: 'Pushes extensions without asking for confirmation.',
      },
      without: {
        type: 'array',
        description:
          'Specifies directory to skip. Can be passed multiple times for skipping multiple directories. Used only if multiple extensions are pushed.',
        requiresArg: true,
      },
      nocheck: {
        type: 'boolean',
        description: 'Pushes without checking for syntax errors.',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export const handler = args =>
  executeAndHandleError(async () => {
    if (
      !(await confirmPush(
        "WARNING: You are about to push using the 'shoutem' developer account. Are you sure about that?",
      ))
    ) {
      console.log('Push aborted'.bold.yellow);
      return;
    }

    if (!args.paths.length) {
      await uploadExtension(args);
      console.log(msg.push.complete());
      return;
    }

  console.warn('DEPRECATED: \'shoutem push\' is deprecated and will be removed with the next major version of the Shoutem CLI. Shoutem now supports release candidate versioning, which allows developers to \'shoutem publish\', for example, 1.0.0-rc.0 versioned extensions which are labeled as "Beta" versions in the Shoutem Builder. App owners who update to RC versions also have the option to revert to the last "stable" (non-rc) version.');
  args.paths = multiglob(args.paths);
  await pushAll(args);
});
