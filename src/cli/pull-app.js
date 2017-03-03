import { pullExtensions } from '../commands/pull';

export const description = 'Downloads a shoutem application with all it\'s extensions';
export const command = 'pull-app <appId>';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command} \n\n${description}`);
};

export async function handler(args) {
  await pullExtensions(args);
}
