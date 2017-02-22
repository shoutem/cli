import { loadExtensionJsonAsync } from '../extension/data';
import { instantiateTemplatePath } from '../extension/template';

export async function generateExtensionJs(extensionPath) {
  const extJson = await loadExtensionJsonAsync(extensionPath);
  const names = (extJson.screens || [])
    .map(({ name }) => name);

  const screensImports = names
    .map(name => `import ${name} from './screens/${name}';`)
    .join('\n');

  const screensNames = names
    .map(name => `  ${name}`)
    .join(',\n');

  await instantiateTemplatePath(
    'extension-js',
    extensionPath,
    { screensImports, screensNames },
    { overwrite: () => true }
  );
}
