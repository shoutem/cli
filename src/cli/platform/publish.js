import _ from 'lodash';
import 'colors';
import { spinify } from '../../services/spinner';
import { ensureUserIsLoggedIn } from '../../commands/login';
import selectPlatform from '../../services/platform-selector';
import { getAvailablePlatforms } from '../../commands/platform';
import { publishPlatform } from '../../clients/extension-manager';
import { executeAndHandleError } from '../../services/error-handler';

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

export const handler = args => executeAndHandleError(() => publishOwnPlatform(args));

export async function publishOwnPlatform({ platform }) {
  const developer = await ensureUserIsLoggedIn();

  const platformId = platform || await selectPlatform(_.filter(await getAvailablePlatforms(), { published: false }));

  await spinify(publishPlatform(platformId));
  console.log('Success!'.green.bold);
  console.log('Your platform is now public!');
}
