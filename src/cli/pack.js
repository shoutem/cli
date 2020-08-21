import { handleError } from '../services/error-handler';
import { ensureInExtensionDir } from '../services/extension';
import shoutemPack from '../services/packer';

export const description = 'Packs a Shoutem extension for upload.';
export const command = 'pack';
export const builder = (yargs) => {
  yargs
    .options({
      nobuild: {
        type: 'boolean',
        description: 'Packs the extension without building it.',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  const extensionDir = await ensureInExtensionDir();

  try {
    const result = await shoutemPack(extensionDir, args);
    console.log(result.package);
  } catch (err) {
    await handleError(err);
  }
}
