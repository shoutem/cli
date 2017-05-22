import { getLatestApps } from '../clients/legacy-service';
import { spinify } from './spinner';
import { prompt } from 'inquirer';
import * as logger from './logger';

export default async function(defaultAppId) {
  const apps = await spinify(getLatestApps(), 'Fetching applications');
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
