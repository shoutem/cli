import mobilizerRunCommand from '../commands/mobilizer-run';
import { handleError } from '../extension/error-handler';

export const description = 'Run shoutem application on using Shoutem preview app';
export const command = 'run [appId]';
export const builder = yargs => {
  return yargs
    .options({
      platformBuild: {
        alias: 'p',
        description: 'use external platform build tool',
        requiresArg: true
      },
      mobileApp: {
        alias: 'm',
        description: 'use external mobile app (ignores platform settings)',
        requiresArg: true
      },
      release: {
        alias: 'r',
        description: 'create a release build',
        type: 'boolean'
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
    await mobilizerRunCommand(args.appId, args)
  } catch (err) {
    await handleError(err);
  }
}
