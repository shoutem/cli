import * as extensionManager from '../clients/extension-manager';
import { uploadExtension } from '../commands/push';
import { getLocalExtensionCanonicalName } from '../clients/local-extensions';
import msg from '../user_messages';
import { spinify } from '../services/spinner';
import { getPlatformRootDir } from '../services/platform';
import { offerInstallationUpdate } from '../cli/extension/publish';
import { loadExtensionJson, ensureInExtensionDir } from '../services/extension';

export async function publishExtension(extDir) {
  const extJson = await loadExtensionJson(extDir);
  const canonicalName = await getLocalExtensionCanonicalName(extDir);
  return spinify(extensionManager.publishExtension(canonicalName), msg.publish.publishInfo(extJson), 'OK');
}

export async function pushAndPublish(args = {}) {
  if (!args.nopush) {
    await uploadExtension({ ...args, publish: true });
  }

  const extPath = ensureInExtensionDir();

  const { name } = loadExtensionJson();
  const { id: extensionId, version } = await publishExtension(extPath);

  if (getPlatformRootDir(extPath, { shouldThrow: false })) {
    await offerInstallationUpdate(extensionId, name, version);
  }
}
