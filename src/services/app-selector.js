import { prompt } from 'inquirer';

import { getLatestApps } from '../clients/legacy-service';
import { spinify } from './spinner';
import logger from './logger';

export default async function (_apps = null) {
  const apps = _apps || await spinify(getLatestApps(), 'Fetching applications');

  logger.info('appSelector', apps);

  return (await prompt({
    type: 'list',
    name: 'appId',
    message: 'Select your app',
    choices: apps.map(app => ({
      name: `${app.name} (${app.id})`,
      value: app.id,
    })),
    pageSize: 20,
  })).appId;
}
