import { executeAndHandleError } from '../../services/error-handler';
import 'colors';
import { installApplicationPlatform } from '../../clients/app-manager';
import { spinify } from '../../services/spinner';

export const description = 'Install a platform on an application';
export const command = 'install';
export const builder = yargs => yargs
  .options({
    app: {
      description: 'Id of the application to install the new platform to',
      type: 'number',
      requiresArg: true,
      alias: 'a',
    },
    platform: {
      description: 'Id of platform to install',
      type: 'string',
      requiresArg: true,
      alias: 'p',
    },
  })
  .usage(`shoutem ${command} [options]\n\n${description}`);

export const handler = args => executeAndHandleError(() => createPlatform(args));

export async function createPlatform({ app, platform }) {
  await spinify(installApplicationPlatform(app, platform));
  console.log('Success!'.green.bold);
}
