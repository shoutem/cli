/* eslint no-console: 0 */
import inquirer from 'inquirer';
import LocalDataClient from '../clients/local-data';
import { ensureUserIsLoggedIn } from './login';
import { ExtensionManagerClient } from '../clients/extension-manager';

function promptDeveloperName() {
  /* eslint no-confusing-arrow: 0 */
  console.log('Enter developer name.');
  return inquirer.prompt({
    name: 'devName',
    message: 'Developer name',
    validate: value => value ? true : 'Developer name cannot be blank.',
  }).then(answer => answer.devName);
}

export function registerDeveloper(userApiToken) {
  const localDataClient = new LocalDataClient();
  const extensionManagerClient = new ExtensionManagerClient(userApiToken);

  return promptDeveloperName()
    .then(devName => extensionManagerClient.createDeveloper(devName))
    .then(devInfo => localDataClient.saveDeveloper(devInfo));
}


const localDataClient = new LocalDataClient();

export async function getDeveloper(userApiToken = null) {
  userApiToken = userApiToken || await localDataClient.loadApiToken();
  if (!userApiToken) {
    return null;
  }

  const extensionManagerClient = new ExtensionManagerClient(userApiToken);

  const devInfo = await localDataClient.loadDeveloper() || await extensionManagerClient.getDeveloper();

  await localDataClient.saveDeveloper(devInfo);
  return devInfo;
}

export async function ensureDeveloperIsRegistered() {
  const apiToken = await ensureUserIsLoggedIn();

  let devInfo = (await getDeveloper(apiToken)) || (await registerDeveloper(apiToken));

  return {
    apiToken,
    name: devInfo.name,
    id: devInfo.id
  };
}
