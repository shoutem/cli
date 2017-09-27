import path from 'path';
import { generateExtensionJs } from '../../src/services/ext-js-generator';
import 'colors'

export async function after(templatePath, extPath, { devName, extJson }) {
  extPath = path.join(extPath, `${devName}.${extJson.name}`);

  return await generateExtensionJs(extPath);
  // useless because initial app does not contain any dependencies
    /*.then(() => {
      console.log('Initializing extension:'.green.bold);
      console.log('Installing packages for server...'.green.bold);
    })
    .then(() => install(path.join(extPath, 'server')))
    .then(() => {
      console.log('Installing packages for app...'.green.bold);
      return install(path.join(extPath, 'app'));
    })
    .then(() => console.log('Packages installed.')); */
}
