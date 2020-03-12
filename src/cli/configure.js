import { executeAndHandleError } from '../services/error-handler';
import {configurePlatform, getPlatformConfig, getPlatformRootDir, setPlatformConfig} from '../services/platform';

export const description = 'Runs platform\'s configure script to sync with native changes to local extensions';
export const command = 'configure';
export const builder = yargs => {
  return yargs
    .options({
      release: {
        alias: 'r',
        description: '(re)configure the app with last published configuration from the shoutem server',
        type: 'boolean',
        default: false
      },
      production: {
        alias: 'p',
        description: 'configure the app for production mode build',
        type: 'boolean',
        default: false
      }
    })
    .usage(`shoutem ${command} \n\n${description}`);
};
export async function handler(args) {
  await executeAndHandleError(async () => {
    const appDir = await getPlatformRootDir();

    await setPlatformConfig(appDir, {
      ...await getPlatformConfig(appDir),
      release: !!args.release,
      production: !!args.production
    });

    await configurePlatform(appDir);
  });
}
