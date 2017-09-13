import * as extensionManager from '../clients/extension-manager';
import * as utils from '../services/extension';
import { uploadExtension } from '../commands/push';
import { ensureInExtensionDir } from '../services/extension';
import { getExtensionCanonicalName } from '../clients/local-extensions';
import msg from '../user_messages';

export async function publishExtension(extDir) {
  const extJson = await utils.loadExtensionJson(extDir);
  console.log(msg.publish.publishInfo(extJson));

  const canonicalName = await getExtensionCanonicalName(extDir);
  return await extensionManager.publishExtension(canonicalName);
}

export async function pushAndPublish(args) {
  if (!args.nopush) {
    await uploadExtension(args);
  }
  const extPath = ensureInExtensionDir();
  return await publishExtension(extPath);
}
