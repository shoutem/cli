import request from 'request-promise-native';
import semver from 'semver';
import cache from './cache';

export function getRepoData(npmUrl) {
  return request({ uri: npmUrl, json: true });
}

async function getNpmjsVersion(npmUrl, tag) {
  const repo = await getRepoData(npmUrl);

  return repo['dist-tags'][tag];
}

export function getVersion(npmUrl, tag) {
  return cache.get({ npmUrl, tag }, 3600 * 48, () => getNpmjsVersion(npmUrl, tag));
}

export async function isLatest(npmUrl, currentVersion) {
  try {
    const latestVersion = await getVersion(npmUrl, 'latest');
    return semver.gte(currentVersion, latestVersion);
  } catch (err) {

    // to allow usage of CLI if npmjs is down
    return true;
  }
}
