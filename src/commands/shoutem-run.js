/* eslint no-console: "off" */
import { getPlatformsPath, getPlatformBuildPath, getPlatformConfigPath, mobileAppConfigPath } from '../clients/cli-paths';
import cliUrls from '../../config/services';
import url from 'url';
import * as npm from '../extension/npm';
import { ensureYarnInstalled } from '../extension/yarn';
import { unlinkDeletedWorkingDirectories } from '../clients/mobile-env';
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
import _ from 'lodash';
import { handleError } from '../extension/error-handler';
import 'colors';

export default async function shoutemRun(platform, appId, options = {}) {
  await ensureYarnInstalled();
  await ensureNodeVersion();

  await unlinkDeletedWorkingDirectories();

  const dev = await ensureDeveloperIsRegistered();

  // platform path not needed if using local mobile app
  const platformPath =
    options.mobileApp ?
    null :
    options.platformBuild || getPlatformBuildPath(path.join(__dirname, '..', '..'));

  // read global mobile-app config used for current server env
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

  // if using local client, it is also used as a build directory
  const buildDirectory = options.mobileApp || path.join(await getPlatformsPath(), 'build');

  // clean is needed when using platform's client
  // but not needed when rerunning the same app
  if (platformPath && !options.noclean) {
    try {
      await killPackager();
      await npm.run(platformPath, 'clean', [
        '--buildDirectory',
        buildDirectory
      ]);
    } catch (err) {
      await handleError(err);
      console.log(msg.run.killPackagerAndAdb().red.bold);
      return null;
    }
  } else {
    console.log('Skipping clean step!');
  }

  Object.assign(mobileAppConfig, {
      platform,
      appId,
      serverApiEndpoint: url.parse(cliUrls.appManager).hostname,
      legacyApiEndpoint: url.parse(cliUrls.legacyService).hostname,
      authorization: dev.apiToken,
      configurationFilePath: await getPlatformConfigPath(),
      platformsDirectory: await getPlatformsPath(),
      workingDirectories: mobileAppConfig.workingDirectories || [],
      excludePackages: ['shoutem.code-push'],
      buildDirectory,
      debug: !options.release,
      offlineMode: true,
      extensionsJsPath: "./extensions.js"
    }
  );

  await writeJsonFile(mobileAppConfig, await mobileAppConfigPath());

  // config.json on the client build dir is required for client's configure script
  // also, scripts have their own package.json
  if (!platformPath) {
    await writeJsonFile(mobileAppConfig, path.join(buildDirectory, 'config.json'));
    await npm.install(path.join(buildDirectory, 'scripts'));
  }

  await npm.run(platformPath || buildDirectory, 'configure', [
    '--configPath',
    await mobileAppConfigPath()
  ]);

  // android run script requires android binaries to be stored near the system's root
  if (process.platform === 'win32') {
    await uncommentBuildDir(buildDirectory);
  }

  const runOptions = [
    '--platform',
    platform
  ];

  if (platformPath) {
    runOptions.push('--buildDirectory');
    runOptions.push(buildDirectory);
  }

  if (options.device) {
    runOptions.push('--device');
    runOptions.push(options.device);
  }
  if (options.simulator) {
    runOptions.push('--simulator');
    runOptions.push(options.simulator);
  }

  if (options.release) {
    runOptions.push('--configuration');
    runOptions.push('Release');
  }

  console.log('Running the app, this may take a minute...');

  const {stdout, stderr} = await npm.run(platformPath || buildDirectory, 'run', runOptions);
  const output = stdout + stderr;
  if (output.indexOf('Code signing is required for product type') > 0) {
    let xcodeProjectPath;
    // if platform is used
    // last runtime configuration is required to get the mobile-app directory
    if (platformPath) {
      const runtimeConfig = await readJsonFile(await getPlatformConfigPath());
      const platform = _.find(runtimeConfig.included, {type: 'shoutem.core.platform-installations'});
      const version = _.get(platform, 'attributes.mobileAppVersion');
      xcodeProjectPath = path.join(await getPlatformsPath(), `v${version}`, 'ios', 'ShoutemApp.xcodeproj');
    } else {
      xcodeProjectPath = path.join(buildDirectory, 'ios', 'ShoutemApp.xcodeproj');
    }

    console.log('Select ShoutemApp target from xcode and activate "Automatically manage signing", ' +
      'select a provisioning profile and then rerun `shoutem run-ios`.');
    await exec(`open "${xcodeProjectPath}"`);
  }

  if (output.indexOf('Unable to find a destination matching the provided destination specifier') > 0) {
    console.log('The app couldn\'t be run because of outdated Xcode version. Please update Xcode to 8.2.1 or later'.bold.red);
    return null;
  }
}

async function uncommentBuildDir(buildDirectory) {
  const buildGradlePath = path.join(buildDirectory, 'android', 'build.gradle');
  let buildGradle = await fs.readFile(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace('//<CLI> buildDir', 'buildDir');
  await fs.writeFile(buildGradlePath, buildGradle);
}

