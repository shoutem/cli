/* eslint no-console: 0 */
import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';
import msg from '../user_messages';


export async function publishExtension(extDir) {
  const dev = await ensureDeveloperIsRegistered();
  const extensionManager = new ExtensionManagerClient(dev.apiToken);

  const extJson = await utils.loadExtensionJsonAsync(extDir);
  console.log(msg.publish.publishInfo(extJson));

  const id = utils.getExtensionCanonicalName(dev.name, extJson.name, extJson.version);

  return await extensionManager.publishExtension(id);
}
