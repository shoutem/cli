import _ from 'lodash';

import { publishPlatform } from '../../clients/extension-manager';
import { getAvailablePlatforms } from '../../commands/platform';
import { executeAndHandleError } from '../../services/error-handler';
import selectPlatform from '../../services/platform-selector';
import { spinify } from '../../services/spinner';

import 'colors';

export const description = 'Publishes a platform.';
export const command = 'publish';
export const builder = yargs => yargs
  .options({
    platform: {
      description: 'Publishes platform with given id.',
      type: 'string',
      requiresArg: true,
      alias: 'p',
    },
  })
  .usage(`shoutem ${command} [options]\n\n${description}`);

export async function publishOwnPlatform({ platform }) {
  const platformId = platform || await selectPlatform(
    _.filter(await getAvailablePlatforms(), { published: false }),
  );

  await spinify(publishPlatform(platformId));
  console.log('Success!'.green.bold);
  console.log('Your platform is now public!');
}

export const handler = args => executeAndHandleError(() => publishOwnPlatform(args));
