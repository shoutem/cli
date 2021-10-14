import _ from 'lodash';
import 'colors';
import { spinify } from '../../services/spinner';
import { ensureUserIsLoggedIn } from '../../commands/login';
import selectPlatform from '../../services/platform-selector';
import { getAvailablePlatforms } from '../../commands/platform';
import { publishPlatform } from '../../clients/extension-manager';
import { executeAndHandleError } from '../../services/error-handler';

export const description = 'Publishes a platform.';
export const command = 'publish';

export async function publishOwnPlatform({ platform }) {
  await ensureUserIsLoggedIn();

  const platformId =
    platform ||
    (await selectPlatform(
      _.filter(await getAvailablePlatforms(), { published: false }),
    ));

  await spinify(publishPlatform(platformId));
  console.log('Success!'.green.bold);
  console.log('Your platform is now public!');
}

export const builder = yargs =>
  yargs
    .options({
      platform: {
        description: 'Publishes platform with given id.',
        type: 'string',
        requiresArg: true,
        alias: 'p',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);

export const handler = args =>
  executeAndHandleError(() => publishOwnPlatform(args));
