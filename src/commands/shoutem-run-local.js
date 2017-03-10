import path from 'path';
import { readJsonFile, writeJsonFile } from '../extension/data';
import * as npm from '../extension/npm';

export async function shoutemRunLocal(platformDir, platform, options = {}) {
  const config = await readJsonFile(path.join(platformDir, 'config.json'));
  config.platform = platform;
  await writeJsonFile(config, path.join(platformDir, 'config.json'));

  const runOptions = [
    '--platform',
    platform
  ];

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

  const {stdout, stderr} = await npm.run(platformDir, 'run', runOptions);
  const output = stdout + stderr;
  if (output.indexOf('Code signing is required for product type') > 0) {

    const xcodeProjectPath = path.join(buildDirectory, 'ios', 'ShoutemApp.xcodeproj');
    console.log('Select ShoutemApp target from xcode and activate "Automatically manage signing", ' +
      'select a provisioning profile and then rerun `shoutem run-ios`.');
    await exec(`open "${xcodeProjectPath}"`);
  }

  if (output.indexOf('Unable to find a destination matching the provided destination specifier') > 0) {
    console.log('The app couldn\'t be run because of outdated Xcode version. Please update Xcode to 8.2.1 or later'.bold.red);
    return null;
  }
}