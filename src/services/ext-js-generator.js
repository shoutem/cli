import { loadExtensionJson } from './/data';
import { instantiateTemplatePath } from './/template';

/**
 * Generate app/extension.js file within the extension.
 * This file is used to export extension's themes and screens.
 */
export async function generateExtensionJs(extensionPath) {
  const extJson = await loadExtensionJson(extensionPath);
  const screensNamesList = (extJson.screens || [])
    .map(({ name }) => name);

  const screensImports = screensNamesList
    .map(name => `import ${name} from './screens/${name}';`)
    .join('\n');

  const screensNames = screensNamesList
    .map(name => `  ${name}`)
    .join(',\n');

  const themesNamesList = (extJson.themes || [])
    .map(({ name }) => name);

  const themesImports = themesNamesList
    .map(name => `import ${name} from './themes/${name}';`)
    .join('\n');

  const themesNames = themesNamesList
    .map(name => `  ${name}`)
    .join(',\n');

  await instantiateTemplatePath(
    'extension-js',
    extensionPath,
    { screensImports, screensNames, themesImports, themesNames },
    { overwrite: () => true }
  );
}
