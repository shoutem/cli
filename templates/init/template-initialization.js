const path = require('path');
const install = require('../../src/services/npm').install;
const generateExtensionJs = require('../../src/services/ext-js-generator').generateExtensionJs;
require('colors');

module.exports = (_, extPath, { devName, extJson }) => {
  extPath = path.join(extPath, `${devName}.${extJson.name}`);

  return generateExtensionJs(extPath)
    .then(() => {
      console.log('Initializing extension:'.green.bold);
      console.log('Installing packages for server...'.green.bold);
    })
    .then(() => install(path.join(extPath, 'server')))
    .then(() => {
      console.log('Installing packages for app...'.green.bold);
      return install(path.join(extPath, 'app'));
    })
    .then(() => console.log('Packages installed.'));
};
