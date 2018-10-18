import _ from 'lodash';
import { prompt } from 'inquirer';
import * as logger from './logger';
import { spinify } from './spinner';
import { getAvailablePlatforms } from '../commands/platform';

export default async function (platforms = null) {
  platforms = platforms || await spinify(getAvailablePlatforms(), 'Fetching platforms');
  logger.info('platformSelector', platforms);

  return (await prompt({
    type: 'list',
    name: 'platformId',
    message: 'Select your platform',
    choices: platforms.map(platform => ({
      name: `${_.get(platform, ['author', 'name'])}@${platform.version} (${platform.id})`,
      value: platform.id,
    })),
    pageSize: 20,
  })).platformId;
}
