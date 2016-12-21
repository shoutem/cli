/* eslint no-console: 0 */
import inquirer from 'inquirer';
import LocalDataClient from '../clients/local-data';
import { ensureUserIsLoggedIn } from './login';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { handleError } from '../extension/error-handler';

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

export function getDeveloper(userApiToken) {
  const extensionManagerClient = new ExtensionManagerClient(userApiToken);
  const localDataClient = new LocalDataClient();

  return localDataClient.loadDeveloper()
    .then(localDevInfo => localDevInfo || extensionManagerClient.getDeveloper())
    .then(devInfo => localDataClient.saveDeveloper(devInfo));
}

export async function exitError(err) {
  await handleError(err);
  process.exit(1);
}

export function ensureDeveloperIsRegistered() {
  const tokenPromise = ensureUserIsLoggedIn();

  let devInfoPromise = tokenPromise
    .then(userApiToken => getDeveloper(userApiToken));

  devInfoPromise = Promise.all([tokenPromise, devInfoPromise])
    .then(([apiToken, devInfo]) => devInfo || registerDeveloper(apiToken));

  return Promise.all([tokenPromise, devInfoPromise])
    .then(([userApiToken, dev]) => ({
      apiToken: userApiToken,
      name: dev.name,
      id: dev.id,
    }))
    .catch(err => exitError(err));
}
