import * as utils from '../extension/data';
import { ensureInExtensionDir } from '../extension/data';
import { ensureUserIsLoggedIn } from '../commands/login';

export async function getExtensionCanonicalName(extensionRoot = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();
  const { name, version } = await utils.loadExtensionJsonAsync(extensionRoot);

  return utils.getExtensionCanonicalName(dev.name, name, version);
}
