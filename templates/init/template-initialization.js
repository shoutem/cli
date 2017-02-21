const path = require('path');
const install = require('../../build/src/extension/yarn').install;
require('colors');

module.exports = (_, extPath, { extJson }) => {
  console.log('Initializing extension:'.green.bold);
  console.log('Installing packages for server...'.green.bold);
  return install(path.join(extPath, extJson.name, 'server'))
    .then(() => console.log('Installing packages for app...'.green.bold))
    .then(() => install(path.join(extPath, extJson.name, 'app')))
    .then(() => {
      console.log('Packages installed.');
    });
};
