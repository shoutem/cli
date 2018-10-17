import { executeAndHandleError } from '../../services/error-handler';
import 'colors';
import { installApplicationPlatform } from '../../clients/app-manager';
import { spinify } from '../../services/spinner';
import { publishPlatform } from '../../clients/extension-manager';

export const description = 'Publish a platform';
export const command = 'publish';
export const builder = yargs => yargs
  .options({
    platform: {
      description: 'Id of platform to install',
      type: 'string',
      requiresArg: true,
      alias: 'p',
    },
  })
  .usage(`shoutem ${command} [options]\n\n${description}`);

export const handler = args => executeAndHandleError(() => createPlatform(args));

export async function createPlatform({ platform }) {
  await spinify(publishPlatform(platform));
  console.log('Success!'.green.bold);
  console.log('Your platform is now public!');
}
