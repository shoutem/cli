/* eslint no-console: 0 */
import shoutemPack from '../extension/packer';
import { ensureInExtensionDir } from '../extension/data';
import { handleError } from '../extension/error-handler';

export const description = 'Pack shoutem extensions for upload';
export const command = 'pack';
export const builder = yargs => {
  return yargs
    .options({
      'no-build': {
        type: 'boolean',
          description: 'Pack the extension without building it.'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};
export async function handler(args) {
  const extensionDir = await ensureInExtensionDir();

  try {
    const result = await shoutemPack(extensionDir, args);
    console.log(result.package);
  } catch(err) {
    await handleError(err);
  }
}
