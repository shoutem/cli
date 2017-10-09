import * as extensionManager from '../clients/extension-manager';
import * as utils from '../services/extension';
import { uploadExtension } from '../commands/push';
import { ensureInExtensionDir } from '../services/extension';
import { getExtensionCanonicalName } from '../clients/local-extensions';
import msg from '../user_messages';
import {spinify} from "../services/spinner";
import {getPlatformRootDir} from "../services/platform";
import {offerInstallationUpdate} from "../cli/extension/publish";
import {loadExtensionJson} from "../services/extension";

export async function publishExtension(extDir) {
  const extJson = await utils.loadExtensionJson(extDir);
  const canonicalName = await getExtensionCanonicalName(extDir);
  return await spinify(extensionManager.publishExtension(canonicalName), msg.publish.publishInfo(extJson), 'OK');
}

export async function pushAndPublish(args = {}) {
  if (!args.nopush) {
    await uploadExtension({ ...args, publish: true });
  }
  const extPath = ensureInExtensionDir();
  const { name } = await loadExtensionJson();
  const { id: extensionId, version } = await publishExtension(extPath);

  if (await getPlatformRootDir(extPath, { shouldThrow: false })) {
    await offerInstallationUpdate(extensionId, name, version);
  }
}
