import { instantiateTemplatePath } from './template';

/**
 * Generate app/extension.js and server/extension.js files within the extension.
 * This file is used to export extension's themes and screens.
 */
export function generateExtensionJs(extensionPath) {
  return instantiateTemplatePath('extension-js', extensionPath, {}, { overwrite: () => true });
}
