import { loadExtensionJson } from './extension';
import * as template from './template';

export default async function instantiateExtensionTemplate(
  localTemplatePath,
  context,
  options,
) {
  if (!context.extensionPath) {
    throw new Error(`Missing extension path for extension-template ${localTemplatePath}`);
  }

  const resolvedContext = { ...context };
  if (!context.extJson && context.extensionPath) {
    resolvedContext.extJson = await loadExtensionJson(context.extensionPath);
  }

  await template.instantiateTemplatePath(
    localTemplatePath,
    resolvedContext.extensionPath,
    resolvedContext,
    options,
  );

  return template.instantiateTemplatePath(
    'extension-js',
    resolvedContext.extensionPath,
    resolvedContext,
    options,
  );
}
