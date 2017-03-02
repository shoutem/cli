import shoutemRunCommand from '../commands/shoutem-run';
import { ensureCocoaPodsInstalled } from '../extension/cocoa-pods';
import msg from '../user_messages';
import { listIosSimulators, listIosDevices } from '../extension/device';
import { prompt } from 'inquirer';
import commandExists from '../extension/command-exists';
import * as cache from '../extension/cache';
import _ from 'lodash';

export const description = 'Run shoutem application on ios platform';
export const command = 'run-ios [appId]';
export const builder = yargs => {
  return yargs
    .options({
      'platform-build': {
        alias: 'p',
        description: 'use external platform build tool',
        requiresArg: true
      },
      'mobile-app': {
        alias: 'm',
        description: 'use external mobile app (ignores platform settings)',
        requiresArg: true
      },
      release: {
        alias: 'r',
        description: 'create a release build',
        type: 'boolean'
      },
      device: {
        alias: 'd',
        description: 'run app on a specific device',
        type: 'string'
      },
      simulator: {
        alias: 's',
        description: 'run app on a specific simulator',
        type: 'string'
      },
      clean: {
        alias: 'c',
        description: 'clean build directory before running',
        type: 'boolean'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  try {
    if (process.platform !== 'darwin') {
      console.log(msg.ios.notOnMac());
      return null;
    }

    await ensureCocoaPodsInstalled();

    const selectedIosDevice = args.simulator || args.device;
    if (selectedIosDevice) {
      await cache.setValue('default_ios_device', selectedIosDevice);
    } else {
      const iosDevices = await listIosDevices();
      const iosSimulators = await listIosSimulators();
      const allDevices = [...iosDevices, ...iosSimulators];

      let defaultIosDevice = await cache.getValue('default_ios_device');
      if (allDevices.indexOf(defaultIosDevice) < 0) {
        defaultIosDevice = null;
      }

      const devicesListChanged =
        !_.isEqual(await cache.getValue('allIosDevices'), allDevices) ||
        args.simulator === '' ||
        args.device === '';

      const { device } = devicesListChanged ? await prompt({
          type: 'list',
          name: 'device',
          message: 'Select a device',
          choices: allDevices,
          default: defaultIosDevice || iosDevices[0] || 'iPhone 6',
          pageSize: 20
        }) : {
          device: defaultIosDevice
        };

      await cache.setValue('default_ios_device', device);
      await cache.setValue('allIosDevices', allDevices);

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

    await shoutemRunCommand('ios', args.appId, args);
  } catch (err) {
    console.error(err.message || err);
  }
}
