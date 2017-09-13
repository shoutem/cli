import * as utils from '../services/data';
import { ensureInExtensionDir } from '../services/data';
import { ensureUserIsLoggedIn } from '../commands/login';

export async function getExtensionCanonicalName(extensionRoot = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();
  const { name, version } = await utils.loadExtensionJson(extensionRoot);

  return utils.getExtensionCanonicalName(dev.name, name, version);
}
