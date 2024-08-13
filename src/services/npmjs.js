import request from 'request-promise-native';
import semver from 'semver';
import * as cache from './cache';

const NPM_LATEST_VERSION = 'npm-latest-version';

async function getLatestData(npmUrl) {
  return await request({ uri: `${npmUrl}/latest`, json: true });
}

async function getLatestNpmjsVersion(npmUrl) {
  const latestData = await getLatestData(npmUrl);
  return latestData.version;
}

async function getLatestVersion(npmUrl, tag) {
  return await cache.get(NPM_LATEST_VERSION, 3600 * 48, () =>
    getLatestNpmjsVersion(npmUrl, tag),
  );
}

export async function isLatest(npmUrl, currentVersion) {
  try {
    const latestVersion = await getLatestVersion(npmUrl);
    return semver.gte(currentVersion, latestVersion);
  } catch (err) {
    // to allow usage of CLI if npmjs is down
    return true;
  }
}
