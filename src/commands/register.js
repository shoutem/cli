import inquirer from 'inquirer';
import LocalDataClient from '../clients/local-data';
import { ensureUserIsLoggedIn } from './login';
import * as extensionManager from '../clients/extension-manager';

function promptDeveloperName() {
  /* eslint no-confusing-arrow: 0 */
  console.log('Enter developer name.');
  return inquirer.prompt({
    name: 'devName',
    message: 'Developer name',
    validate: value => value ? true : 'Developer name cannot be blank.',
  }).then(answer => answer.devName);
}

export function registerDeveloper() {
  const localDataClient = new LocalDataClient();

  return promptDeveloperName()
    .then(devName => extensionManager.createDeveloper(devName))
    .then(devInfo => localDataClient.saveDeveloper(devInfo));
}


const localDataClient = new LocalDataClient();

export async function getDeveloper() {
  const devInfo = await localDataClient.loadDeveloper() || await extensionManager.getDeveloper();

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
