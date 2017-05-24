import url from 'url';
import { exec } from 'mz/child_process';
import _ from 'lodash';
import { join } from 'path';
import rmrf from 'rmfr';
import ip from 'ip';
import tmp from 'tmp-promise';
import Promise from 'bluebird';
import * as tunnel from '../extension/tunnel';
import { spinify } from '../extension/spinner';
import { startPackager } from './react-native';
import { mobileEnvPath } from '../clients/cli-paths';
import * as platform from './platform';
import { readJsonFile, writeJsonFile } from './data';
import { printMobilizerQR } from '../commands/qr-generator';
import { getInstallations } from '../clients/app-manager';
import { getPublishingProperties } from '../clients/legacy-service';
import * as analytics from './analytics';
import kill from 'tree-kill';

async function getAppDir(appId) {
  return join(await mobileEnvPath(), appId.toString());
}

async function getExtensionsPackagesUrls(appId) {
  const installations = await getInstallations(appId);
  return installations.map(inst => inst.location.app.package);
}

async function getCurrentApplicationState(appId, buildConfig) {
  return await Promise.props({
    publishingProperties: getPublishingProperties(appId),
    installationsUrls: getExtensionsPackagesUrls(appId),
    platformVersion: platform.getPlatformVersion(appId),
    buildConfig
  });
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

  analytics.setAppId(appId);

  const packageJson = await readJsonFile(join(path, 'package.json')) || {};
  
  if (opts.mobileapp && packageJson.name !== '@shoutem/mobile-app') {
    throw new Error('Invalid mobile app project path');
  }

  const mobileConfig = await platform.createMobileConfig(path, opts);

  const currentAppState = await spinify(
    getCurrentApplicationState(appId, mobileConfig),
    'Checking for changes since last run...'
  );

  const oldAppState = await getOldApplicationState(path, appId);

  if (!opts.clean && _.isEqual(currentAppState, oldAppState)) {
    await platform.runShoutemWatcher(path);
    return null;
  }

  if (!opts.mobileapp) {
    await spinify(rmrf(path), 'Deleting old platform code...');
    await spinify(platform.downloadApp(appId, path), 'Downloading current platform code...');
  }

  await platform.fixPlatform(path, appId);
  await platform.preparePlatform(path, mobileConfig);

  await saveApplicationState(path, appId, currentAppState);
}

export async function nativeRun(opts) {
  const path = opts.mobileapp || await getAppDir(opts.appId);

  await syncApp(path, opts);

  const packagerPromise = startPackager(path, { resolveOnReady: true });

  try {
    const runResult = await platform.runPlatform(path, opts);
    const output = runResult.stdout + runResult.stderr;

    if (output.indexOf('Code signing is required for product type') > 0) {
      let xcodeProjectPath = join(path, 'ios', 'ShoutemApp.xcworkspace');
      console.log('Select ShoutemApp target from xcode and activate "Automatically manage signing", ' +
        'select a provisioning profile and then rerun `shoutem run-ios`.');
      await exec(`open "${xcodeProjectPath}"`);
      const packagerProcess = (await packagerPromise).childProcess;
      await packagerProcess.kill('SIGINT');
    }
  } catch (exc) {
    try {
      const packagerProcess = (await packagerPromise).childProcess;
      await packagerProcess.kill('SIGINT');
    } catch (err) {
      // ignored
    }

    throw exc;
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

  const { childProcess, spawned } = await startPackager(path, { resolveOnReady: true });
  try {
    await platform.buildPlatform(path, platformName, outputDir);
  }
  finally {
    spawned.catch(err => { /* ignored */ });
    kill(childProcess.pid);
  }
}