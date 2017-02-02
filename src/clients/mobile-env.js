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
import fs from 'mz/fs';



export async function installMobileEnv(tarballUrl) {
  await rimraf(await mobileEnvPath());

  await download(tarballUrl, await mobileEnvPath(), {extract: true, strip: 1});
  console.log(msg.env.info.downloaded());

  await yarn.install(path.join(await mobileAppPath(), 'build-script'));
  console.log(msg.env.info.dependenciesInstalled());

  const config = await readJsonFile(await mobileAppConfigTemplatePath());
  config.appId = null;
  config.serverApiEndpoint = cliUrls.appManager;
  await saveMobileConfig(config);

  if (process.platform === 'win32') {
    await uncommentBuildDir();
  }
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
