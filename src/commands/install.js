import inquirer from 'inquirer';
import { installExtension, createApp } from '../clients/app-manager';
import { getLatestApps } from '../clients/legacy-service';
import { getExtensionCanonicalName } from '../clients/local-extensions';
import * as extensionManager from '../clients/extension-manager';
import selectApp from '../services/app-selector';
import { ensureInExtensionDir } from '../services/extension';
import msg from '../user_messages';


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
  const appList = await getLatestApps();

  if (appList.length === 0) {
    if (!await promptCreateNewApp()) {
      return await getNewApp();
    }
  }

  const appId = await selectApp(appList);
  return appList.filter(app => app.id === appId)[0] || await getNewApp();
}

export async function createNewApp(name) {
  return await createApp({ name });
}

export async function installLocalExtension(appId, extensionRoot = ensureInExtensionDir()) {
  const canonicalName = await getExtensionCanonicalName(extensionRoot);
  const extensionId = await extensionManager.getExtensionId(canonicalName);

  if (extensionId) {
    await installExtension(appId, extensionId);
  } else {
    throw new Error(msg.install.notExtensionDir());
  }

  return extensionId;
}
