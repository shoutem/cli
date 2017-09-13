import request from 'request-promise-native';
import semver from 'semver';
import * as cache from './/cache';

export async function getRepoData(npmUrl) {
  return await request({ uri: npmUrl, json: true });
}

async function getNpmjsVersion(npmUrl, tag) {
  const repo = await getRepoData(npmUrl);

  return repo['dist-tags'][tag];
}

export async function getVersion(npmUrl, tag) {
  return await cache.get({ npmUrl, tag }, 3600 * 6, () => getNpmjsVersion(npmUrl, tag));
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
