import {
  configurePlatform,
  getPlatformConfig,
  getPlatformRootDir,
  setPlatformConfig,
} from '../services/platform';
import { executeAndHandleError } from '../services/error-handler';

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


export function configure(args) {
  const appDir = getPlatformRootDir();
  const config = getPlatformConfig(appDir);

  setPlatformConfig(appDir, {
    ...config,
    release: !!args.release,
    production: !!args.production,
  });

  return configurePlatform(appDir);
}

export const handler = args => executeAndHandleError(configure, args);
