import runPlatform from '../commands/run-platform';
import { handleError } from '../extension/error-handler';

export const description = 'Run shoutem application on android platform';
export const command = 'run-android [appId]';
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
      release: {
        alias: 'r',
          description: 'create a release build',
          type: 'boolean'
      },
      device: {
        alias: 'd',
          description: 'run app on a specific device',
          requiresArg: true
      },
      clean: {
        alias: 'c',
        description: 'forces the client platform to be cleaned up, configured, linked and compiled from scratch',
        type: 'boolean'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};
export async function handler(args) {
  try {
    await runPlatform('android', args);
  } catch (err) {
    await handleError(err);
  }
}
