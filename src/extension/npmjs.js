import request from 'request-promise-native';
import semver from 'semver';

export async function getRepoData(npmUrl) {
  return await request({ uri: npmUrl, json: true });
}

export async function getVersion(npmUrl, tag) {
  const repo = await getRepoData(npmUrl);

  return repo['dist-tags'][tag];
}

export async function isLatest(npmUrl, currentVersion) {
  const latestVersion = await getVersion(npmUrl, 'latest');
  return semver.gte(currentVersion, latestVersion);
}
