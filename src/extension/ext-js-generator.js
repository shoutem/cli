import { loadExtensionJsonAsync } from '../extension/data';
import { instantiateTemplatePath } from '../extension/template';

export async function generateExtensionJs(extensionPath) {
  const extJson = await loadExtensionJsonAsync(extensionPath);
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
