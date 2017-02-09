/* eslint no-console: 0 */
import { publishExtension } from '../commands/publish';
import { handleError } from '../extension/error-handler';
import { pushAll } from '../commands/push-all';
import msg from '../user_messages';

export const description = 'Publish current extension version.';
export const command = 'publish-all';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push and publish extensions without building them. Use this option carefully!'
  },
  nopush: {
    type: 'boolean',
    description: 'Publish extensions without pushing them first. Use this option carefully!'
  }
};
export async function handler(args) {
  try {
    const extPaths = await pushAll(args);
    for (const extPath of extPaths) {
      const result = await publishExtension(extPath);
      console.log(msg.publish.complete(result.attributes));
    }
  } catch (err) {
    await handleError(err);
  }
}
