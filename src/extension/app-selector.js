import { LegacyServiceClient } from '../clients/legacy-service';
import { ensureUserIsLoggedIn } from '../commands/login';
import { spinify } from './spinner';
import { prompt } from 'inquirer';

export default async function(defaultAppId) {
  const apiToken = await ensureUserIsLoggedIn();

  const apps = await spinify(await new LegacyServiceClient(apiToken).getLatestAppsAsync(), 'Fetching applications');

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
