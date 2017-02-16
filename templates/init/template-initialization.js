const path = require('path');
const install = require('../../build/src/extension/yarn').install;

module.exports = (_, extPath, { extJson }) => {
  return install(path.join(extPath, extJson.name, 'server'))
    .then(() => install(path.join(extPath, extJson.name, 'app')));
};
