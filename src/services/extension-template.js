import { loadExtensionJson } from './extension';
import { instantiateTemplatePath } from './template';

// eslint-disable-next-line import/prefer-default-export
export async function instantiateExtensionTemplate(localTemplatePath, context, opts) {
  if (!context.extJson && context.extensionPath) {
    // eslint-disable-next-line no-param-reassign
    context.extJson = loadExtensionJson(context.extensionPath);
  }

  if (!context.extensionPath) {
    throw new Error(`Missing extension path for extension-template ${localTemplatePath}`);
  }

  await instantiateTemplatePath(localTemplatePath, context.extensionPath, context, opts);
  return instantiateTemplatePath('extension-js', context.extensionPath, context, opts);
}
