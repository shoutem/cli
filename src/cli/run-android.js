import shoutemRunCommand from '../commands/shoutem-run';
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
      noclean: {
        alias: 'n',
        description: 'don\'t clean build directory before running',
        type: 'boolean'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};
export async function handler(args) {
  try {
    await shoutemRunCommand('android', args.appId, args)
  } catch (err) {
    await handleError(err);
  }
}
