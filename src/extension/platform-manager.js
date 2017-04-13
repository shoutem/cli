import path from 'path';
import rmrf from 'rmfr';
import { mobileEnvPath } from '../clients/cli-paths';
import * as platform from './platform';
import { readJsonFile, pathExists } from './data';

export async function getAppDir(appId) {
  return path.join(await mobileEnvPath(), appId);
}

export async function isAppConfigured(appId) {
  return await pathExists(path.join(await getAppDir(appId), 'configured.info'));
}

export async function isAppSynced(appId) {
  if (!await isAppConfigured(appId)) {
    return false;
  }

  const serverVersion = await platform.getPlatformVersion(appId);
  const { version } = await readJsonFile(path.join(await getAppDir(appId), 'package.json')) || {};
  if (!version || serverVersion !== version) {
    return false;
  }

  //TODO check for installed extensions
  //TODO check for publishing properties

  return true;
}

export async function syncApplication(appId) {
  if (await isAppSynced(appId)) {
    return null;
  }

  const path = await getAppDir(appId);
  await rmrf(path);
  
  await platform.downloadApp(appId, path);
}
