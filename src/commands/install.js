/* eslint no-console: 0 */
import async from 'async';
import inquirer from 'inquirer';

import { AppManagerClient } from '../clients/app-manager';
import { LegacyServiceClient } from '../clients/legacy-service';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';

import msg from '../user_messages';


export function promptAppSelect(apps, callback) {
  const appNames = apps.map(app => app.name);
  const longestName = appNames.sort((x, y) => y.length - x.length)[0];
  const newName = `${longestName}1`;
  const question = {
    type: 'list',
    name: 'appIndex',
    message: 'Select app to install extension',
    choices: appNames.concat([
      new inquirer.Separator(),
      {
        name: 'Create a new app',
        value: newName,
        short: 'new app',
      },
    ]),
    filter: appName => appNames.indexOf(appName),
  };

  inquirer.prompt([question])
    .then(answer => callback(null, answer.appIndex))
    .catch(callback);
}

export function promptCreateNewApp(callback) {
  inquirer.prompt({
    type: 'list',
    name: 'createNew',
    message: 'You have no apps. Create a new one?',
    choices: ['yes', 'no'],
  }).then(answer => callback(null, answer.createNew === 'yes'))
    .catch(callback);
}

export function promptAppName(callback) {
  inquirer.prompt({
    name: 'appName',
    message: 'App name',
    default: 'MyApp',
  }).then(answer => callback(null, answer.appName))
    .catch(callback);
}

function exit(err) {
  if (err) console.log(err.message);
  process.exit(Number(Boolean(err)));
}

export function ensureApp(callback) {
  ensureDeveloperIsRegistered()
    .then(developerInfo => {
      const apiToken = developerInfo.apiToken;
      const legacyService = new LegacyServiceClient(apiToken);
      const appManager = new AppManagerClient(apiToken, null);

      function getNewApp() {
        promptAppName((promptErr, appName) => {
          if (promptErr) exit(promptErr);
          else {
            appManager.createApp({ name: appName }, (createErr, app) => {
              if (createErr) exit(createErr);
              else callback(null, app);
            });
          }
        });
      }

      legacyService.getLatestApps((appErr, appList) => {
        if (appErr) return exit(appErr);

        if (appList.length === 0) {
          return promptCreateNewApp((promptErr, createNew) => {
            if (promptErr || !createNew) exit(promptErr);
            else getNewApp();
          });
        }

        return promptAppSelect(appList, (selectErr, appIndex) => {
          if (selectErr) callback(selectErr);
          else if (appIndex === -1) getNewApp();
          else process.nextTick(() => callback(null, appList[appIndex]));
        });
      });
    });
}

export function createNewApp(appName, callback) {
  ensureDeveloperIsRegistered()
    .then(developerInfo => {
      const apiToken = developerInfo.apiToken;
      const appManager = new AppManagerClient(apiToken, null);
      appManager.createApp({ name: appName }, callback);
    })
    .catch(console.error);
}

export function installLocalExtension(appId, callback) {
  ensureDeveloperIsRegistered()
    .then(developerInfo => {
      const devName = developerInfo.name;
      const apiToken = developerInfo.apiToken;
      const appManager = new AppManagerClient(apiToken, appId);
      const extensionManager = new ExtensionManagerClient(apiToken);

      async.waterfall([
        utils.loadExtensionJson,

        (extJson, done) => {
          const name = extJson.name;
          const version = extJson.version;
          const canonicalName = utils.getExtensionCanonicalName(devName, name, version);
          extensionManager.getExtensionId(canonicalName, done);
        },

        (extensionId, done) => {
          if (extensionId) appManager.installExtension(extensionId, done);
          else {
            process.nextTick(() => {
              done(new Error(msg.install.notExtensionDir()));
            });
          }
        },
      ], callback);
    })
    .catch(console.error);
}

export function installExtensionById(extensionId, appId, callback) {
  ensureDeveloperIsRegistered()
    .then(developerInfo => {
      const apiToken = developerInfo.apiToken;
      const appManager = new AppManagerClient(apiToken, appId);
      appManager.installExtension(extensionId, callback);
    })
    .catch(console.error);
}
