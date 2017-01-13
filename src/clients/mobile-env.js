import {
  mobileAppPath,
  mobileEnvPath,
  mobileAppConfigPath,
  mobileAppConfigTemplatePath,
  mobileAppPackageJson
} from './cli-paths';
import { readJsonFile, writeJsonFile } from '../extension/data';
import cliUrls from '../../config/services';
import path from 'path';
import rimraf from 'rmfr';
import msg from '../user_messages';
import * as yarn from '../extension/yarn';
import download from 'download';

export async function installMobileEnv(tarbalUrl) {
  await rimraf(await mobileEnvPath());

  await download(tarbalUrl, await mobileEnvPath(), {extract: true, strip: 1});
  console.log(msg.env.info.downloaded());

  await yarn.install(path.join(await mobileAppPath(), 'build-script'));
  console.log(msg.env.info.dependenciesInstalled());

  const config = await readJsonFile(await mobileAppConfigTemplatePath());
  config.appId = null;
  config.serverApiEndpoint = cliUrls.appManager;
  await saveMobileConfig(config);
}

export async function loadMobileConfig() {
  return await readJsonFile(await mobileAppConfigPath());
}

export async function saveMobileConfig(config) {
  await writeJsonFile(config, await mobileAppConfigPath());
}

export async function loadMobilePackageJson() {
  return await readJsonFile(await mobileAppPackageJson());
}
