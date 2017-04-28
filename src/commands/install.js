import inquirer from 'inquirer';

import { AppManagerClient } from '../clients/app-manager';
import { LegacyServiceClient } from '../clients/legacy-service';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';

import msg from '../user_messages';


export async function promptAppSelect(apps) {
  const { appId } = await inquirer.prompt({
    type: 'list',
    name: 'appId',
    message: 'Select app to install extension',
    choices: apps.map(app => ({ name: `${app.name} (${app.id})`, value: app.id })).concat([
      new inquirer.Separator(),
      {
        name: 'Create a new app',
        value: null,
        short: 'new app',
      },
    ])
  });

  return appId;
}

export async function promptCreateNewApp() {
  const { answerNew } = await inquirer.prompt({
    type: 'list',
    name: 'createNew',
    message: 'You have no apps. Create a new one?',
    choices: ['yes', 'no'],
  });

  return answerNew === 'yes';
}

export async function promptAppName() {
  const { appName } = await inquirer.prompt({
    name: 'appName',
    message: 'App name',
    default: 'MyApp',
  });

  return appName;
}

async function getNewApp(appManager) {
  const name = await promptAppName();
  return await appManager.createAppAsync({ name });
}

export async function ensureApp() {
  const { apiToken } = await ensureDeveloperIsRegistered();
  const legacyService = new LegacyServiceClient(apiToken);
  const appManager = new AppManagerClient(apiToken, null);
  const appList = await legacyService.getLatestAppsAsync();

  if (appList.length === 0) {
    if (!await promptCreateNewApp()) {
      return await getNewApp(appManager);
    }
  }

  const appId = await promptAppSelect(appList);
  return appList.filter(app => app.id === appId)[0] || await getNewApp(appManager);
}

export async function createNewApp(name) {
  const { apiToken } = await ensureDeveloperIsRegistered();
  const appManager = new AppManagerClient(apiToken, null);
  return await appManager.createAppAsync({ name });
}

export async function installLocalExtension(appId) {
  const dev = await ensureDeveloperIsRegistered();
  const appManager = new AppManagerClient(dev.apiToken, appId);
  const extensionManager = new ExtensionManagerClient(dev.apiToken);

  const { name, version } = await utils.loadExtensionJsonAsync();
  const canonicalName = utils.getExtensionCanonicalName(dev.name, name, version);
  const extensionId = await extensionManager.getExtensionIdAsync(canonicalName);

  if (extensionId) {
    await appManager.installExtensionAsync(extensionId);
  } else {
    throw new Error(msg.install.notExtensionDir());
  }

  return extensionId;
}

export async function installExtensionById(extensionId, appId) {
  const { apiToken } = await ensureDeveloperIsRegistered();
  const appManager = new AppManagerClient(apiToken, appId);
  return await appManager.installExtension(extensionId);
}
