import {
  loadExtensionJson,
  ensureInExtensionDir,
  getExtensionCanonicalName,
} from '../services/extension';

import { ensureUserIsLoggedIn } from '../commands/login';

export async function getLocalExtensionCanonicalName(extensionRoot = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();
  const { name, version } = loadExtensionJson(extensionRoot);

  return getExtensionCanonicalName(dev.name, name, version);
}
