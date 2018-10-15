import _ from 'lodash';
import os from 'os';
import semver from 'semver';

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

export function validatePlatformJson(platformJson) {
  if (!semver.valid(platformJson.version)) {
    throw new Error('platform.json \'version\' must be a valid semantic version');
  }

  if (!semver.valid(platformJson.mobileAppVersion)) {
    throw new Error('platform.json \'mobileAppVersion\' must be a valid semantic version');
  }

  const appetizeKey = _.get(platformJson, ['settings', 'appetizeKey']);
  if (_.isNull(appetizeKey)) {
    throw new Error(`platform.json must contain settings.appetizeKey${
      os.EOL}NOTE: Appetize (App preview in Builder) is currently not supported for custom platforms,${
      os.EOL}      so if you don't have, just leave an empty string as a value`);
  }
}
