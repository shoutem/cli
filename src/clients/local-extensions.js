import * as utils from '../services/extension';
import { ensureInExtensionDir } from '../services/extension';
import { ensureUserIsLoggedIn } from '../commands/login';

export async function getExtensionCanonicalName(extensionRoot = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();
  const { name, version } = await utils.loadExtensionJson(extensionRoot);

  return utils.getExtensionCanonicalName(dev.name, name, version);
}
