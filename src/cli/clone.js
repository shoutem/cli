import { handleError } from '../extension/error-handler';
import { pullApp } from '../commands/pull';

export const description = 'Downloads a shoutem application with all it\'s extensions';
export const command = 'clone [appId]';
export const builder = yargs => {
  return yargs
    .options({
      mobileapp: {
        alias: 'm',
        description: 'use external mobile app (ignores platform settings)',
        requiresArg: true
      }
    })
    .usage(`shoutem ${command} \n\n${description}`);
};

export async function handler(args) {
  try {
    await pullApp(args, process.cwd());
  } catch (err) {
    await handleError(err);
  }
}
