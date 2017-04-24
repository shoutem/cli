import mobilizerRunCommand from '../commands/mobilizer-run';
import { handleError } from '../extension/error-handler';

export const description = 'Run shoutem application on using Shoutem preview app';
export const command = 'run [appId]';
export const builder = yargs => {
  return yargs
    .options({
      platformbuild: {
        alias: 'p',
        description: false,
        requiresArg: true
      },
      mobileapp: {
        alias: 'm',
        description: 'use external mobile app (ignores platform settings)',
        requiresArg: true
      },
      noclean: {
        alias: 'n',
        description: 'don\'t clean build directory before running',
        type: 'boolean'
      },
      local: {
        alias: 'l',
        description: 'don\'t use tunneling for Shoutem app, connect directly to packager. Note: ' +
          'this computer and iphone/android must be connected to the same network and port 8081 must be opened.',
        type: 'boolean'
      },
      dev: {
        alias: 'd',
        description: 'use dev version of js bundle which degrades performance but allows for debug tools to be used',
        type: 'boolean'
      },
      small: {
        alias: 's',
        description: 'display smaller ASCII QR code which could be unreadable in some fonts',
        type: 'boolean'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};
export async function handler(args) {
  try {
    await mobilizerRunCommand(args)
  } catch (err) {
    await handleError(err);
  }
}
