import { loadExtensionJson } from "./extension";
import template from "./template";

export async function instantiateExtensionTemplate(localTemplatePath, context, opts) {
  if (!context.extJson && context.extensionPath) {
    context.extJson = loadExtensionJson(context.extensionPath);
  }

  if (!context.extensionPath) {
    throw new Error(`Missing extension path for extension-template ${localTemplatePath}`);
  }

  await template.instantiateTemplatePath(localTemplatePath, context.extensionPath, context, opts);
  return template.instantiateTemplatePath('extension-js', context.extensionPath, context, opts);
}
