import { getLatestApps } from '../clients/legacy-service';
import { spinify } from './spinner';
import { prompt } from 'inquirer';
import * as logger from './logger';
import * as cache from './cache-env';

export default async function(apps = null) {
  const defaultAppId = await cache.getValue('last-used-app');

  apps = apps || await spinify(getLatestApps(), 'Fetching applications');
  logger.info('appSelector', apps);

  return (await prompt({
    type: 'list',
    name: 'appId',
    message: 'Select your app',
    choices: apps.map(app => ({
      name: `${app.name} (${app.id})`,
      value: app.id
    })),
    default: defaultAppId,
    pageSize: 20
  })).appId;
}
