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
import { exec } from 'mz/child_process';
import { killPackager, startPackager } from '../extension/react-native';
import { handleError } from '../extension/error-handler';
import selectApp from '../extension/app-selector';
import { printMobilizerQR } from '../commands/qr-generator';
import 'colors';

export default async function (appId, options = {}) {
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
  appId = appId || await selectApp(mobileAppConfig.appId);

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
      platform: 'any',
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

  const configureOptions = [
    '--configPath',
    await mobileAppConfigPath(),
    '--skipNativeDependencies',
    true
  ];

  await npm.run(platformPath || buildDirectory, 'configure', configureOptions);

  const packagerPromise = startPackager(buildDirectory);
  await printMobilizerQR();
  return await packagerPromise;
}
