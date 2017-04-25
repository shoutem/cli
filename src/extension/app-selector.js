import { LegacyServiceClient } from '../clients/legacy-service';
import { ensureUserIsLoggedIn } from '../commands/login';
import { startSpinner } from './spinner';
import { prompt } from 'inquirer';

export default async function(defaultAppId) {
  const spinner = startSpinner('Fetching applications');
  const apps = await new LegacyServiceClient(await ensureUserIsLoggedIn()).getLatestAppsAsync();
  spinner.stop(true);

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
