import { ensureInExtensionDir } from '../services/data';
import { instantiateTemplatePath } from '../services/template';
import * as yarn from '../services/yarn';

export async function createPage(pageName) {
  await yarn.ensureYarnInstalled();

  const extensionDir = ensureInExtensionDir();
  const { path }  = await instantiateTemplatePath('page', extensionDir, { pageName });

  return { path, pageName };
}
