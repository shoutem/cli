import { executeAndHandleError } from '../services/error-handler';
import { clone } from '../commands/clone';

export const description = 'Downloads a shoutem application with all it\'s extensions';
export const command = 'clone [appId]';
export const builder = yargs => {
  return yargs
    .options({
      platform: {

        alias: 'p',
        description: 'use external mobile app (ignores platform settings)',
        requiresArg: true
      },
      noconfigure: {
        description: 'skip platform configuration step',
        type: 'boolean'
      },
      dir: {
        description: 'directory name for the cloned app',
        requiresArg: true
      },
      force: {
        alias: 'f',
        description: 'destroys destination directory if it already exists',
        type: 'boolean'
      }
    })
    .usage(`shoutem ${command} \n\n${description}`);
};

export const handler = args => executeAndHandleError(clone, args, process.cwd());
