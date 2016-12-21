import {
  mobileAppPath,
  mobileEnvPath,
  mobileAppConfigPath,
  mobileAppConfigTemplatePath,
  mobileAppPackageJson
} from './cli-paths';
import { readJsonFile, writeJsonFile } from '../extension/data';
import request from 'request-promise-native';
import cliUrls from '../../config/services';
import tarball from 'tarball-extract';
import bluebird from 'bluebird';
import tmp from 'tmp-promise';
import path from 'path';
import rimraf from 'rmfr';
import msg from '../user_messages';
import * as yarn from '../extension/yarn';

const extractTarballDownloadAsync = bluebird.promisify(tarball.extractTarballDownload);

export async function installMobileEnv(tarbalUrl) {
  const removeMobileEnvPromise = rimraf(await mobileEnvPath());

  const tmpDir = path.join((await tmp.dir()).path, 'package.tgz');

  await removeMobileEnvPromise;
  await extractTarballDownloadAsync(tarbalUrl, tmpDir, await mobileEnvPath(), {});
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
