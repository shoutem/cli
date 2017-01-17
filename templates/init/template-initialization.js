const path = require('path');
const install = require('../../build/src/extension/yarn').install;

module.exports = (_, extPath) => {
  return install(path.join(extPath, 'server'))
    .then(() => install(path.join(extPath, 'app')));
};
