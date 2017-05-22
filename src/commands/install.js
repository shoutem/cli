import inquirer from 'inquirer';
import { AppManagerClient, installExtension, createApp } from '../clients/app-manager';
import { LegacyServiceClient } from '../clients/legacy-service';
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

async function getNewApp() {
  const name = await promptAppName();
  return await createApp({ name });
}

export async function ensureApp() {
  const { apiToken } = await ensureDeveloperIsRegistered();
  const legacyService = new LegacyServiceClient(apiToken);
  const appList = await legacyService.getLatestAppsAsync();

  if (appList.length === 0) {
    if (!await promptCreateNewApp()) {
      return await getNewApp();
    }
  }

  const appId = await promptAppSelect(appList);
  return appList.filter(app => app.id === appId)[0] || await getNewApp();
}

export async function createNewApp(name) {
  return await createApp({ name });
}

export async function installLocalExtension(appId) {
  const { name, version } = await utils.loadExtensionJsonAsync();

  // TODO developer's name!
  const canonicalName = utils.getExtensionCanonicalName('???', name, version);

  const extensionId = await extensionManager.getExtensionIdAsync(canonicalName);

  if (extensionId) {
    await installExtension(appId, extensionId);
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
