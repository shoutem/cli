import fs from 'fs-extra';
import * as extensionManager from '../clients/extension-manager';
import { createProgressHandler } from '../services/progress-bar';
import { spinify, startSpinner } from '../services/spinner';
import msg from '../user_messages';
import { getHostEnvName } from '../clients/server-env';
import { validatePlatformArchive } from '../services/validation';

export async function uploadPlatform(platformArchiveProvider) {
  const archivePath = await spinify(platformArchiveProvider.getArchivePath(), 'Packing the platform');

  await spinify(validatePlatformArchive(platformArchiveProvider), 'Validating platform archive');

  const { size } = await fs.stat(archivePath);
  const stream = fs.createReadStream(archivePath);

  let spinner = null;
  const platformResponse = await extensionManager.uploadPlatform(
    stream,
    createProgressHandler({
      msg: 'Upload progress',
      total: size,
      onFinished: () => spinner = startSpinner('Processing upload...'),
    }),
    size,
  );
  if (spinner) {
    spinner.stop(true);
    console.log(`Processing upload... [${'OK'.green.bold}]`);
  }
  console.log(`${msg.platform.uploadingInfo(getHostEnvName())} [${'OK'.green.bold}]`);

  platformArchiveProvider.cleanUp();

  return platformResponse;
}
