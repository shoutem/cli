import { executeAndHandleError } from '../extension/error-handler';
import { getPlatformRootDir } from '../extension/platform';
import * as npm from '../extension/npm';

export const description = 'Runs platform\'s configure script to sync with changes to native code and server';
export const command = 'pull';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command} \n\n${description}`);
};
export async function handler() {
  await executeAndHandleError(async () => {
    const appDir = await getPlatformRootDir();
    await npm.run(appDir, 'configure');
  });
}
