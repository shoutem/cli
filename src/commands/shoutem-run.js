/* eslint no-console: "off" */
import { getPlatformsPath, getPlatformBuildPath, getPlatformConfigPath, mobileAppConfigPath } from '../clients/cli-paths';
import cliUrls from '../../config/services';
import url from 'url';
import * as yarn from '../extension/yarn';
import { ensureYarnInstalled } from '../extension/yarn';
import { ensureNodeVersion } from '../extension/node';
import { ensureDeveloperIsRegistered } from '../commands/register';
import { readJsonFile, writeJsonFile } from '../extension/data';
import path from 'path';
import msg from '../user_messages';

export default async (platform, appId, options = {}) => {
  await ensureNodeVersion();
  await ensureYarnInstalled();

  const serverApiEndpoint = url.parse(cliUrls.appManager).hostname;
  const dev = await ensureDeveloperIsRegistered();
  const platformPath = options.platformBuild || getPlatformBuildPath(path.join(__dirname, '..', '..', '..'));

  try {
    await yarn.run(platformPath, 'clean');
  } catch (err) {
      console.log(err);
      console.log(msg.run.killPackagerAndAdb());
      return null;

  }

  const mobileAppConfig = await readJsonFile(await mobileAppConfigPath()) || {};
  Object.assign(mobileAppConfig, {
      platform,
      appId,
      serverApiEndpoint,
      authorization: dev.apiToken,
      configurationFilePath: await getPlatformConfigPath(),
      platformsDirectory: await getPlatformsPath(),
      workingDirectories: mobileAppConfig.workingDirectories || [],
      excludePackages: ['shoutem.code-push']
    }
  );

  // due to limitation of win32 file path length
  if (process.platform === 'win32') {
    mobileAppConfig.buildDirectory = 'c:\\shoutem-tmp';
  }

  await writeJsonFile(mobileAppConfig, await mobileAppConfigPath());

  await yarn.run(platformPath, 'configure', [
    '--',
    `--configPath ${await mobileAppConfigPath()}`
  ]);

  await yarn.run(platformPath, 'run', [
    '--',
    `--platform ${platform}`
  ]);
}
