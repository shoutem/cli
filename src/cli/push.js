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
      },
      nocheck: {
        type: 'boolean',
        description: 'Push without checking for syntax errors'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

async function push(args) {
  const developerWarning = 'WARNING: you are about tu push using shoutem developer. Are you sure about that?';
  const deprecationWarning = 'WARNING: shoutem push command is deprecated. Use shoutem publish instead';

  if (!await confirmPush(developerWarning)) {
    console.log('Push aborted'.bold.yellow);
    return null;
  }

  console.log(deprecationWarning.yellow.bold);

  if (!args.paths.length) {
    await uploadExtension(args);
    console.log(msg.push.complete());
    return;
  }

  args.paths = multiglob(args.paths);
  
  return pushAll(args);
}

export const handler = args => executeAndHandleError(push, args);

