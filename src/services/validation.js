import os from 'os';
import _ from 'lodash';
import semver from 'semver';
import { getValue } from '../services/cache-env';

export function isValidExtensionName(name) {
  return /^[a-z]+[a-z0-9\-]*$/.test(name);
}

export function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

export function containsSpace(str) {
  return str.indexOf(' ') > -1;
}

export function isValidPlatformUrl(url) {
  const re = /http(s):\/\/.*/;
  const match = url.match(re);
  return match != null;
}

export async function validatePlatformArchive(archiveProvider) {
  const platformJson = await archiveProvider.getPlatformJson();

  if (!semver.valid(platformJson.version)) {
    throw new Error('platform.json \'version\' must be a valid semantic version');
  }

  // when publishing from local source, we pack with a correct root directory name, so no need to check that one
  if (archiveProvider.getType() === 'remote') {
    const jsonPath = await archiveProvider.getPlatformJsonPath();

    if (!jsonPath.includes(`platform-${platformJson.version}`)) {
      throw new Error('archive root directory must be named like platform-x.y.z where x.y.z is version of the platform');
    }
  }

  if (!semver.valid(platformJson.mobileAppVersion)) {
    throw new Error('platform.json \'mobileAppVersion\' must be a valid semantic version');
  }

  const developer = await getValue('developer');
  const isCustomPlatform = developer.name !== 'shoutem';
  const appetizeKey = _.get(platformJson, ['settings', 'appetizeKey']);

  if (!isCustomPlatform && _.isNil(appetizeKey)) {
    throw new Error(`platform.json must contain settings.appetizeKey`);
  }
}
