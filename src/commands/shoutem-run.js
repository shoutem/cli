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
import fs from 'mz/fs';

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
  const buildDirectory = path.join(await getPlatformsPath(), 'build');

  Object.assign(mobileAppConfig, {
      platform,
      appId,
      serverApiEndpoint,
      authorization: dev.apiToken,
      configurationFilePath: await getPlatformConfigPath(),
      platformsDirectory: await getPlatformsPath(),
      workingDirectories: mobileAppConfig.workingDirectories || [],
      excludePackages: ['shoutem.code-push'],
      buildDirectory,
      debug: !options.release
    }
  );

  await writeJsonFile(mobileAppConfig, await mobileAppConfigPath());

  await yarn.run(platformPath, 'configure', [
    '--',
    `--configPath ${await mobileAppConfigPath()}`
  ]);

  if (process.platform === 'win32') {
    await uncommentBuildDir(buildDirectory);
  }

  const runOptions = [
    '--',
    `--platform ${platform}`
  ];
  if (options.device) {
    runOptions.push(`--device "${options.device}"`);
  }
  if (options.simulator) {
    runOptions.push(`--simulator "${options.simulator}"`);
  }

  await yarn.run(platformPath, 'run', runOptions);
}

async function uncommentBuildDir(buildDirectory) {
  const buildGradlePath = path.join(buildDirectory, 'android', 'build.gradle');
  let buildGradle = await fs.readFile(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace('//<CLI> buildDir', 'buildDir');
  await fs.writeFile(buildGradlePath, buildGradle);
}
