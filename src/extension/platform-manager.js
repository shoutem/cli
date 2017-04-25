import url from 'url';
import { exec } from 'mz/child_process';
import _ from 'lodash';
import { join } from 'path';
import rmrf from 'rmfr';
import ip from 'ip';
import tmp from 'tmp-promise';
import * as tunnel from '../extension/tunnel';
import { startPackager } from './react-native';
import { mobileEnvPath } from '../clients/cli-paths';
import * as platform from './platform';
import { readJsonFile, writeJsonFile } from './data';
import { printMobilizerQR } from '../commands/qr-generator';
import { getAppManager, getLegacyServiceClient } from '../clients/clients-factory';

async function getAppDir(appId) {
  return join(await mobileEnvPath(), appId.toString());
}

async function getCurrentApplicationState(appId, buildConfig) {
  const publishingProperties = await (await getLegacyServiceClient()).getPublishingProperties(appId);
  const installations = await (await getAppManager(appId)).getInstallations();
  const installationsUrls = installations.map(inst => inst.location.app.package);
  const platformVersion = await platform.getPlatformVersion(appId);

  return {
    publishingProperties,
    installationsUrls,
    buildConfig,
    platformVersion
  };
}

async function getApplicationStatePath(platformPath) {
  return join(platformPath, 'last_build_state.json');
}

async function saveApplicationState(path, appId, state) {
  return await writeJsonFile(state, await getApplicationStatePath(path, appId));
}

async function getOldApplicationState(path, appId) {
  return await readJsonFile(await getApplicationStatePath(path, appId));
}

async function syncApp(path, opts) {
  const { appId } = opts;

  if (opts.mobileapp && (await readJsonFile(join(path, 'package.json')) || {}).name !== '@shoutem/mobile-app') {
    throw new Error('Invalid mobile app project path');
  }

  const mobileConfig = await platform.createMobileConfig(path, opts);

  const currentAppState = await getCurrentApplicationState(appId, mobileConfig);
  const oldAppState = await getOldApplicationState(path, appId);

  if (_.isEqual(currentAppState, oldAppState)) {
    return null;
  }

  if (!opts.mobileapp) {
    await rmrf(path);
    await platform.downloadApp(appId, path);
  }

  await platform.fixPlatform(path, appId);
  await platform.preparePlatform(path, mobileConfig);

  await saveApplicationState(path, appId, currentAppState);
}

export async function nativeRun(opts) {
  const path = opts.mobileapp || await getAppDir(opts.appId);

  await syncApp(path, opts);

  const [, runResult] = await Promise.all([
    startPackager(path, { resolveOnReady: true }),
    platform.runPlatform(path, opts)
  ]);

  const output = runResult.stdout + runResult.stderr;

  if (output.indexOf('Code signing is required for product type') > 0) {
    let xcodeProjectPath = path.join(path, `v${version}`, 'ios', 'ShoutemApp.xcodeproj');
    console.log('Select ShoutemApp target from xcode and activate "Automatically manage signing", ' +
      'select a provisioning profile and then rerun `shoutem run-ios`.');
    await exec(`open "${xcodeProjectPath}"`);
    return null;
  }
}

export async function mobilizerRun(options) {
  options = { ...options, skipNativeDependencies: true, platform: 'any' };
  const path = options.mobileapp || await getAppDir(options.appId);

  await syncApp(path, options);

  await startPackager(path, { resolveOnReady: true });

  if (options.local) {
    console.log('Make sure that the phone running Shoutem app is connected to the same network as this computer'.yellow);
    if (process.platform === 'win32') {
      console.log('If Shoutem app on your phone fails to load, try opening the 8081 TCP port manually from your Windows Firewall or disabling the firewall temporarily'.yellow);
    } else {
      console.log('Make sure that the 8081 TCP port is not blocked on this computer'.yellow);
    }
    await printMobilizerQR(ip.address(), 8081, options);
  } else {
    await printMobilizerQR(url.parse(await tunnel.start(8081)).hostname, 80, options);
  }

  console.log('Packager is being run within this process. Please keep this process running if app is used in debug mode'.bold.yellow);
}

export async function build(platformName, options, outputDir = process.cwd()) {
  options = {
    ...options,
    excludePackages: [],
    debug: false,
    production: false,
    workingDirectories: [],
    platform: platformName
  };

  const path = options.mobileapp || (await tmp.dir()).path;
  await syncApp(path, options);

  await platform.buildPlatform(path, platformName, outputDir);
}
