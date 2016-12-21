/* eslint no-console: 0 */
import async from 'async';

import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';

import msg from '../user_messages';


export function publishExtension(callback) {
  ensureDeveloperIsRegistered()
    .then(developerInfo => {
      const devName = developerInfo.name;
      const apiToken = developerInfo.apiToken;
      const extensionManager = new ExtensionManagerClient(apiToken);
      let extension;

      async.waterfall([
        utils.loadExtensionJson,

        (extJson, done) => {
          extension = extJson;
          console.log(msg.publish.publishInfo(extJson));
          const id = utils.getExtensionCanonicalName(devName, extJson.name, extJson.version);
          extensionManager.publishExtension(id, done);
        },
      ],
        err => callback(err, extension));
    })
    .catch(console.error);
}
