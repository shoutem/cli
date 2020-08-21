import fs from 'fs-extra';
import _ from 'lodash';
import semver from 'semver';

import { uploadPlatform, getPlatforms, getDeveloper } from '../clients/extension-manager';
import { getHostEnvName } from '../clients/server-env';
import { spinify, startSpinner } from '../services/spinner';
import createProgressHandler from '../services/progress-bar';
import { validatePlatformArchive } from '../services/validation';
import msg from '../user_messages';

export async function uploadPlatformArchive(platformArchiveProvider) {
  if (platformArchiveProvider.getType() === 'local') {
    await platformArchiveProvider.validateShoutemIgnore();
  }

  const archivePath = await spinify(platformArchiveProvider.getArchivePath(), 'Packing the platform...');
  if (!fs.pathExists(archivePath)) {
    throw new Error('Unable to create or download archive.');
  }

  await spinify(validatePlatformArchive(platformArchiveProvider), 'Validating platform archive...');

  const { size } = await fs.stat(archivePath);
  const stream = fs.createReadStream(archivePath);

  let spinner = null;
  const platformResponse = await uploadPlatform(
    stream,
    createProgressHandler({
      msg: 'Upload progress',
      total: size,
      // eslint-disable-next-line
      onFinished: () => spinner = startSpinner('Processing upload...'),
    }),
    size,
  );
  if (spinner) {
    spinner.stop(true);
    console.log(`Processing upload... [${'OK'.green.bold}].`);
  }
  console.log(`${msg.platform.uploadingInfo(getHostEnvName())} [${'OK'.green.bold}].`);

  platformArchiveProvider.cleanUp();

  return platformResponse;
}

export async function getAvailablePlatforms(limit) {
  const developer = await getDeveloper();
  const allPlatforms = await getPlatforms();

  let ownPlatforms = _.filter(
    allPlatforms,
    platform => _.get(platform, ['author', 'name']) === developer.name,
  );

  // highest versions first
  ownPlatforms.sort((p1, p2) => semver.compare(p1.version, p2.version, true) * -1);

  if (_.isNumber(limit)) {
    ownPlatforms = _.slice(ownPlatforms, 0, limit);
  }

  return ownPlatforms;
}
