import { instantiateTemplatePath } from './template';

/**
 * Generate app/extension.js and server/extension.js files within the extension.
 * This file is used to export extension's themes and screens.
 */
export async function generateExtensionJs(extensionPath) {
  return await instantiateTemplatePath(
    'extension-js',
    extensionPath,
    {},
    { overwrite: () => true },
  );
}
