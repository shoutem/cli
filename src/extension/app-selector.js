import { getLatestApps } from '../clients/legacy-service';
import { spinify } from './spinner';
import { prompt } from 'inquirer';

export default async function(defaultAppId) {
  const apps = await spinify(getLatestApps(), 'Fetching applications');

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
