import path from 'path';
import url from 'url';
import cliUrls from '../../config/services';
import * as npm from '../extension/npm';
import { ensureDeveloperIsRegistered } from '../commands/register';
import { getPlatformBuildPath, mobileAppConfigPath, getPlatformsPath, getPlatformConfigPath, getBuildPath } from '../clients/cli-paths';
import { readJsonFile, writeJsonFile } from '../extension/data';
import 'colors';

export async function configure(platform, appId, { workingDirectories, excludePackages, debug, skipNativeDependencies, production }) {
  const previousConfig = await getBuildConfig();

  const mobileAppConfig = {
    platform,
    buildDirectory: await getBuildPath(),
    appId,
    serverApiEndpoint: url.parse(cliUrls.appManager).hostname,
    legacyApiEndpoint: url.parse(cliUrls.legacyService).hostname,
    authorization: (await ensureDeveloperIsRegistered()).apiToken,
    configurationFilePath: await getPlatformConfigPath(),
    platformsDirectory: await getPlatformsPath(),
    workingDirectories: workingDirectories || previousConfig.workingDirectories || [],
    excludePackages: excludePackages || ['shoutem.code-push'],
    debug: !!debug,
    offlineMode: true,
    extensionsJsPath: "./extensions.js",
    skipNativeDependencies: !!skipNativeDependencies,
    production: !!production
  };

  await setBuildConfig(mobileAppConfig);

  await npm.run(getPlatformBuildPath(), 'configure', [
    '--configPath',
    await mobileAppConfigPath()
  ]);

  return mobileAppConfig;
}

export async function build(platform, outputDir) {
  await npm.run(getPlatformBuildPath(), 'build', [
    '--platform',
    platform,
    '--outputDirectory',
    outputDir,
    '--buildDirectory',
    path.join(await getPlatformsPath(), 'build')
  ]);
}

export async function clean() {
  try {
    await npm.run(getPlatformBuildPath(), 'clean', [
      '--buildDirectory',
      await getBuildPath()
    ]);
  } catch (err) {
    err.message = (err.message || '') +
      '\nCould not clean up the build directory. Please check that react-packager and adb are not running'.red.bold;
    throw err;
  }
}

export async function getBuildConfig() {
  return await readJsonFile(await mobileAppConfigPath()) || {}
}

export async function setBuildConfig(config) {
  return await writeJsonFile(config, await mobileAppConfigPath());
}

export async function run(platform, { device, simulator, release }) {
  const runOptions = ['--platform', platform];

  if (device) {
    runOptions.push('--device', device);
  }

  if (simulator) {
    runOptions.push('--simulator', simulator);
  }

  if (release) {
    runOptions.push('--configuration', 'Release');
  }

  await npm.run()
}