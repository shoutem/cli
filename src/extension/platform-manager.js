import url from 'url';
import { exec } from 'mz/child_process';
import _ from 'lodash';
import { join } from 'path';
import rmrf from 'rmfr';
import fs from 'mz/fs';
import ip from 'ip';
import * as tunnel from '../extension/tunnel';
import { startPackager } from './react-native';
import { mobileEnvPath } from '../clients/cli-paths';
import * as platform from './platform';
import { readJsonFile, pathExists } from './data';
import { printMobilizerQR } from '../commands/qr-generator';

async function getAppDir(appId) {
  return join(await mobileEnvPath(), appId);
}

async function isAppConfigured(appId) {
  const path = join(await getAppDir(appId), 'configured.info');
  return await pathExists(path);
}

async function markAppConfigured(appId) {
  const path = join(await getAppDir(appId), 'configured.info');
  await fs.writeFile(path, 'This file is to mark the successful app configuration step');
}

async function isAppSynced(mobileConfig) {
  const { appId } = mobileConfig;

  if (!await isAppConfigured(appId)) {
    return false;
  }

  const oldConfigFile = await readJsonFile(join(await getAppDir(appId), 'config.json')) || {};
  if (!_.isEqual(mobileConfig, oldConfigFile)) {
    return false;
  }

  const serverVersion = await platform.getPlatformVersion(appId);
  const { version } = await readJsonFile(join(await getAppDir(appId), 'package.json')) || {};
  if (!version || serverVersion !== version) {
    return false;
  }

  //TODO check for installed extensions
  //TODO check for publishing properties

  return true;
}

async function syncApp(opts) {
  const path = await getAppDir(opts.appId);
  const mobileConfig = await platform.createMobileConfig(path, opts);

  if (await isAppSynced(mobileConfig)) {
    return null;
  }

  await rmrf(path);
  
  await platform.downloadApp(opts.appId, path);
  await platform.fixPlatform(path);
  await platform.preparePlatform(path, mobileConfig);
  await markAppConfigured(opts.appId);
}

export async function nativeRun(opts) {
  await syncApp(opts);

  const path = await getAppDir(opts.appId);

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
  options.skipNativeDependencies = true;
  options.platform = 'any';
  await syncApp(options);

  const path = await getAppDir(options.appId);
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
