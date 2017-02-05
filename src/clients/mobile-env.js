import { mobileAppConfigPath } from './cli-paths';
import { readJsonFile, writeJsonFile, pathExists } from '../extension/data';
import bluebird from 'bluebird';

export async function loadMobileConfig() {
  return await readJsonFile(await mobileAppConfigPath());
}

export async function saveMobileConfig(config) {
  await writeJsonFile(config, await mobileAppConfigPath());
}

export async function unlinkDeletedWorkingDirectories() {
  const config = await loadMobileConfig() || {};
  const directories = config.workingDirectories || [];
  config.workingDirectories = await bluebird.filter(directories, pathExists);
  await saveMobileConfig(config);
}