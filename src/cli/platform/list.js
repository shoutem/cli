import _ from 'lodash';
import 'colors';
import { spinify } from '../../services/spinner';
import { ensureUserIsLoggedIn } from '../../commands/login';
import { getAvailablePlatforms } from '../../commands/platform';
import { executeAndHandleError } from '../../services/error-handler';

export const description = 'Lists available platforms';
export const command = 'list';
export const builder = yargs => yargs
  .options({
    all: {
      description: 'Lists all available platforms',
      type: 'boolean',
      alias: 'a',
    },
  })
  .usage(`shoutem ${command} [options]\n\n${description}`);

export const handler = args => executeAndHandleError(() => listPlatforms(args));

export async function listPlatforms({ all }) {
  const developer = await ensureUserIsLoggedIn();
  const platforms = await spinify(getAvailablePlatforms(all ? null : 20));

  console.log('\nID\t\t\t\tPublished\tAuthor@Version');

  _.forEach(platforms, (platform) => {
    const { id, published, version } = platform;
    const author = _.get(platform, ['author', 'name']);

    console.log(`${id}\t${published}\t\t${author}@${version}`);
  });
}
