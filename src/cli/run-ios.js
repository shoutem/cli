import shoutemRunCommand from '../commands/shoutem-run';
import { ensureCocoaPodsInstalled } from '../extension/cocoa-pods';
import msg from '../user_messages';
import { listIosSimulators, listIosDevices } from '../extension/device';
import { prompt } from 'inquirer';
import commandExists from '../extension/command-exists';

export const description = 'Run shoutem application on ios platform';
export const command = 'run-ios [appId]';
export const builder = {
  platformBuild: {
    alias: 'p',
    description: 'use external platform build tool'
  },
  release: {
    alias: 'r',
    description: 'true for release build, false for debug build',
    type: 'boolean'
  },
  device: {
    alias: 'd',
    description: 'run app on a specific device'
  },
  simulator: {
    alias: 's',
    description: 'run app on a specific simulator'
  }
};

export async function handler(args) {
  try {
    if (process.platform !== 'darwin') {
      console.log(msg.ios.notOnMac());
      return null;
    }

    await ensureCocoaPodsInstalled();

    if (!args.simulator && !args.device) {
      const iosDevices = await listIosDevices();
      const iosSimulators = await listIosSimulators();

      const { device } = await prompt({
        type: 'list',
        name: 'device',
        message: 'Select a device',
        choices: [...iosDevices, ...iosSimulators],
        default: iosDevices[0] || 'iPhone 6',
        pageSize: 20
      });
      if (iosDevices.indexOf(device) > -1) {
        if (!await commandExists('ios-deploy')) {
          console.log('ios-deploy is not installed.\nInstall it ' +
            'by running `npm install -g ios-deploy` or `sudo npm install -g ios-deploy --unsafe-perm=true`');
          return null;
        }
        args.device = device;
      } else {
        args.simulator = device;
      }
    }

    await shoutemRunCommand('ios', args.appId, args)
  } catch (err) {
    console.error(err.message || err);
  }
}
