import { executeAndHandleError } from '../extension/error-handler';
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
      }
    })
    .usage(`shoutem ${command} \n\n${description}`);
};

export async function handler(args) {
  await executeAndHandleError(() => clone(args, process.cwd()));
}
