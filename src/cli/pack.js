import shoutemPack from '../services/packer';
import { ensureInExtensionDir } from '../services/extension';
import { handleError } from '../services/error-handler';

export const description = 'Pack shoutem extensions for upload';
export const command = 'pack';
export const builder = yargs => {
  return yargs
    .options({
      nobuild: {
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
