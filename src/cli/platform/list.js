import _ from 'lodash';
import { executeAndHandleError } from '../../services/error-handler';
import 'colors';
import { spinify } from '../../services/spinner';
import { getPlatforms } from '../../clients/extension-manager';
import semver from 'semver';

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
  const allPlatforms = await spinify(getPlatforms());

  const groupBy = _.groupBy(allPlatforms, 'author.name');
  let sortedPlatformsByAuthor = _.map(groupBy, platforms => platforms.sort(
    (p1, p2) => semver.compare(p1.version, p2.version, true) * -1), // highest versions first
  );

  if (!all) {
    sortedPlatformsByAuthor = _.map(sortedPlatformsByAuthor, platforms => _.slice(platforms, 0, 3));
  }

  console.table(['apples', 'oranges', 'bananas']);
  console.log('\nID\t\t\t\tAuthor\t\tVersion\t\tPublished');
  _.forEach(sortedPlatformsByAuthor, (platforms) => {
    _.forEach(platforms, (platform) => {
      console.log(
        _.get(platform, 'id'),
        `${_.get(platform, ['author', 'name'])}@${_.get(platform, 'version')}\t\t${_.get(platform, 'published')}`,
      );
    });
  });
}
