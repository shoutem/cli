import 'colors';
import _ from 'lodash';
import { spinify } from '../../services/spinner';
import selectApp from '../../services/app-selector';
import { ensureUserIsLoggedIn } from '../../commands/login';
import selectPlatform from '../../services/platform-selector';
import { executeAndHandleError } from '../../services/error-handler';
import { installApplicationPlatform } from '../../clients/app-manager';
import { getPlatformConfig, getPlatformRootDir } from '../../services/platform';

export const description = 'Install a platform on an application';
export const command = 'install';

export async function installPlatform({ app, platform }) {
  await ensureUserIsLoggedIn();

  let appConfig;
  if (await getPlatformRootDir(process.cwd(), { shouldThrow: false })) {
    appConfig = await getPlatformConfig();
  }

  // if app ID is not explicitly passed, then try to get the ID from current directory, otherwise ask the user
  const appId = app || _.get(appConfig, 'appId') || (await selectApp());

  const platformId = platform || (await selectPlatform());

  await spinify(installApplicationPlatform(appId, platformId));
  console.log('Your platform is now installed on your app');
  console.log('Success!'.green.bold);
}

export const builder = yargs =>
  yargs
    .options({
      app: {
        description: 'Installs new platform into app with given app id.',
        type: 'number',
        requiresArg: true,
        alias: 'a',
      },
      platform: {
        description: 'Installs platform with given id.',
        type: 'string',
        requiresArg: true,
        alias: 'p',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);

export const handler = args =>
  executeAndHandleError(() => installPlatform(args));
