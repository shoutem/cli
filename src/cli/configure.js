import { executeAndHandleError } from '../services/error-handler';
import {configurePlatform, getPlatformConfig, getPlatformRootDir, setPlatformConfig} from '../services/platform';

export const description = 'Runs the platform\'s configure script to install dependencies, link extensions and their dependencies and run extension build scripts';
export const command = 'configure';
export const builder = yargs => {
  return yargs
    .options({
      release: {
        alias: 'r',
        description: '(re)configure the app with latest (re)published configuration from the Shoutem builder',
        type: 'boolean',
        default: false
      },
      production: {
        alias: 'p',
        description: 'configure the app for production build, these are used when publishing to the App Store or Google Play store',
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
