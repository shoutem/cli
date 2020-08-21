import { prompt } from 'inquirer';

import { getLatestApps } from '../clients/legacy-service';
import * as logger from './logger';
import { spinify } from './spinner';

export default async function (apps = null) {
  const resolvedApps = apps || await spinify(getLatestApps(), 'Fetching applications...');
  logger.info('appSelector', resolvedApps);

  return (await prompt({
    type: 'list',
    name: 'appId',
    message: 'Select your app',
    choices: resolvedApps.map(app => ({
      name: `${app.name} (${app.id})`,
      value: app.id,
    })),
    pageSize: 20,
  })).appId;
}
