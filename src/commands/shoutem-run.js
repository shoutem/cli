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
import { prompt } from 'inquirer';
import { LegacyServiceClient } from '../clients/legacy-service';
import { exec } from 'mz/child_process';
import { killPackager } from '../extension/react-native';
const _ = require('lodash');

export default async (platform, appId, options = {}) => {
  await ensureNodeVersion();
  await ensureYarnInstalled();
  await killPackager();

  const serverApiEndpoint = url.parse(cliUrls.appManager).hostname;
  const dev = await ensureDeveloperIsRegistered();
  const platformPath = options.platformBuild || getPlatformBuildPath(path.join(__dirname, '..', '..', '..'));

  const mobileAppConfig = await readJsonFile(await mobileAppConfigPath()) || {};

  const { apiToken } = await ensureDeveloperIsRegistered();
  const legacyService = new LegacyServiceClient(apiToken);

  if (!appId) {
    const apps = await legacyService.getLatestAppsAsync();
    appId = (await prompt({
      type: 'list',
      name: 'appId',
      message: 'Select your app',
      choices: apps.map(app => ({
        name: `${app.name} (${app.id})`,
        value: app.id
      })),
      default: mobileAppConfig.appId,
      pageSize: 20
    })).appId;
  }

  try {
    await yarn.run(platformPath, 'clean');
  } catch (err) {
      console.log(err);
      console.log(msg.run.killPackagerAndAdb());
      return null;
  }

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
    runOptions.push(`--device "${options.device.replace(' ', '\\ ')}"`);
  }
  if (options.simulator) {
    runOptions.push(`--simulator "${options.simulator.replace(' ', '\\ ')}"`);
  }

  console.log('Running the app, this may take a minute...');
  const runResult = await yarn.run(platformPath, 'run', runOptions, 'default');
  console.log(runResult);
  if (runResult.indexOf('Code signing is required for product type') > 0) {
    const runtimeConfig = await readJsonFile(await getPlatformConfigPath());
    const platform =_.find(runtimeConfig.included, { type: 'shoutem.core.platform-installations' });
    const version = _.get(platform, 'attributes.mobileAppVersion');
    const xcodeProjectPath = path.join(await getPlatformsPath(), `v${version}`, 'ios', 'ShoutemApp.xcodeproj');
    console.log('Select ShoutemApp target from xcode and activate "Automatically manage signing", ' +
      'select a provisioning profile and then rerun `shoutem run-ios`.');
    await exec(`open ${xcodeProjectPath}`);
  }
}

async function uncommentBuildDir(buildDirectory) {
  const buildGradlePath = path.join(buildDirectory, 'android', 'build.gradle');
  let buildGradle = await fs.readFile(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace('//<CLI> buildDir', 'buildDir');
  await fs.writeFile(buildGradlePath, buildGradle);
}
