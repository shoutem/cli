const path = require('path');
const install = require('../../src/extension/npm').install;
const generateExtensionJs = require('../../src/extension/ext-js-generator').generateExtensionJs;
require('colors');

module.exports = (_, extPath, { extJson }) => {
  return generateExtensionJs(path.join(extPath, extJson.name))
    .then(() => {
      console.log('Initializing extension:'.green.bold);
      console.log('Installing packages for server...'.green.bold);
    })
    .then(() => install(path.join(extPath, extJson.name, 'server')))
    .then(() => console.log('Installing packages for app...'.green.bold))
    .then(() => install(path.join(extPath, extJson.name, 'app')))
    .then(() => console.log('Packages installed.'));
};
