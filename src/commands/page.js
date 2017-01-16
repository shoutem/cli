import { ensureInExtensionDir } from '../extension/data';
import { instantiateTemplatePath } from '../extension/template';
import * as yarn from '../extension/yarn';

export async function createPage(pageName) {
  await yarn.ensureYarnInstalled();

  const extensionDir = ensureInExtensionDir();
  const { path }  = await instantiateTemplatePath('page', extensionDir, { pageName });

  return { path, pageName };
}
