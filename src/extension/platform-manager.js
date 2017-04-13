import _ from 'lodash';
import { join } from 'path';
import rmrf from 'rmfr';
import fs from 'mz/fs';
import { startPackager } from './react-native';
import { mobileEnvPath } from '../clients/cli-paths';
import * as platform from './platform';
import { readJsonFile, pathExists } from './data';

async function getAppDir(appId) {
  return join(await mobileEnvPath(), appId);
}

async function isAppConfigured(appId) {
  const path = join(await getAppDir(appId), 'configured.info');
  return await pathExists(path);
}

async function markAppConfigured(appId) {
  const path = join(await getAppDir(appId), 'configured.info');
  await fs.writeFile(path, 'This file is to mark the successful app configuration step');
}

async function isAppSynced(mobileConfig) {
  const { appId } = mobileConfig;

  if (!await isAppConfigured(appId)) {
    return false;
  }

  const oldConfigFile = await readJsonFile(join(await getAppDir(appId), 'config.json')) || {};
  if (!_.isEqual(mobileConfig, oldConfigFile)) {
    return false;
  }

  const serverVersion = await platform.getPlatformVersion(appId);
  const { version } = await readJsonFile(join(await getAppDir(appId), 'package.json')) || {};
  if (!version || serverVersion !== version) {
    return false;
  }

  //TODO check for installed extensions
  //TODO check for publishing properties

  return true;
}

async function syncApp(opts) {
  const path = await getAppDir(opts.appId);
  const mobileConfig = await platform.createMobileConfig(path, opts);

  if (await isAppSynced(mobileConfig)) {
    return null;
  }

  await rmrf(path);
  
  await platform.downloadApp(opts.appId, path);
  await platform.fixPlatform(path);
  await platform.preparePlatform(path, mobileConfig);
  await markAppConfigured(opts.appId);
}

export async function nativeRun(opts) {
  await syncApp(opts);

  const path = await getAppDir(opts.appId);

  await Promise.all([
    startPackager(path, { resolveOnReady: false }),
    platform.runPlatform(path, opts)
  ]);
}
