import {
  loadExtensionJson,
  ensureInExtensionDir,
  getExtensionCanonicalName as getCanonicalName,
} from '../services/extension';

import { ensureUserIsLoggedIn } from '../commands/login';

export async function getExtensionCanonicalName(extensionRoot = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();
  const { name, version } = loadExtensionJson(extensionRoot);

  return getCanonicalName(dev.name, name, version);
}
