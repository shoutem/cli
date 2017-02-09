/* eslint no-console: 0 */
import msg from '../user_messages';
import { publishExtension } from '../commands/publish';
import { uploadExtension } from '../commands/push';
import { handleError } from '../extension/error-handler';
import { ensureInExtensionDir } from '../extension/data';

export const description = 'Publish current extension version.';
export const command = 'publish';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push and publish the extension without building it. Use this option carefully!'
  },
  nopush: {
    type: 'boolean',
    description: 'Publish the extension without pushing it first. Use this option carefully!'
  }
};
export async function handler(args) {
  try {
    if (!args.nopush) {
      await uploadExtension(args);
    }
    const extPath = ensureInExtensionDir();
    const result = await publishExtension(extPath);
    console.log(msg.publish.complete(result.attributes));
  } catch (err) {
    await handleError(err);
    if (err.response && err.response.statusCode === 404) {
      console.log('You must `shoutem push` the extension before publishing it.');
    }
  }
}
