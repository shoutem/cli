/* eslint no-console: 0 */
import msg from '../user_messages';
import { publishExtension, pushAndPublish } from '../commands/publish';
import { uploadExtension } from '../commands/push';
import { pushAll } from '../commands/push-all';
import { handleError } from '../extension/error-handler';
import { ensureInExtensionDir } from '../extension/data';
import multiglob from '../extension/multiglob';

export const description = 'Publish current extension version.';
export const command = 'publish [paths...]';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push and publish the extension without building it. Use this option carefully!'
  },
  nopush: {
    type: 'boolean',
    description: 'Publish the extension without pushing it first. Use this option carefully!'
  },
  without: {
    type: 'array',
    description: 'Directory to skip. Can be passed multiple times for skipping multiple directories. Used only if multiple extensions are published.',
    requiresArg: true,
  }
};
export async function handler(args) {
  try {
    if (args.paths.length === 0) {
      const result = await pushAndPublish(args);
      console.log(msg.publish.complete(result.attributes));
    } else {
      args.paths = multiglob(args.paths);
      const extPaths = await pushAll(args);

      for (const extPath of extPaths) {
        const result = await publishExtension(extPath);
        console.log(msg.publish.complete(result.attributes));
      }
    }
  } catch (err) {
    await handleError(err);
  }
}
