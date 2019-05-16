import inquirer from 'inquirer';
import { installExtension, createApp } from '../clients/app-manager';
import { getLatestApps } from '../clients/legacy-service';
import { getLocalExtensionCanonicalName } from '../clients/local-extensions';
import { getExtensionId } from '../clients/extension-manager';
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
  return createApp({ name });
}

export async function ensureApp() {
  const appList = await getLatestApps();

  if (appList.length === 0) {
    if (!await promptCreateNewApp()) {
      return getNewApp();
    }
  }

  const appId = await selectApp(appList);
  return appList.filter(app => app.id === appId)[0] || await getNewApp();
}

export function createNewApp(name) {
  return createApp({ name });
}

export async function installLocalExtension(appId, extensionRoot = ensureInExtensionDir()) {
  const canonicalName = await getLocalExtensionCanonicalName(extensionRoot);
  const extensionId = await getExtensionId(canonicalName);

  if (extensionId) {
    await installExtension(appId, extensionId);
  } else {
    throw new Error(msg.install.notExtensionDir());
  }

  return extensionId;
}
