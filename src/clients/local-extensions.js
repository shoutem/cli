import fs from 'mz/fs';
import path from 'path';
import * as utils from '../extension/data';
import { ensureInExtensionDir } from '../extension/data';
import { ensureUserIsLoggedIn } from '../commands/login';

export function getExtensionConfig(extensionRoot = ensureInExtensionDir()) {
  return fs.readFile(path.join(extensionRoot, 'extension.json'), 'utf8').then(JSON.parse);
}

export async function getExtensionCanonicalName() {
  const dev = await ensureUserIsLoggedIn();
  const config = await getExtensionConfig();

  return utils.getExtensionCanonicalName(dev.name, config.name, config.version);
}
