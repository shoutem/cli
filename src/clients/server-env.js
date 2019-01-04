const path = require('path');
const fs = require('fs-extra');

const cliPaths = require(path.resolve(__dirname, '../clients/cli-paths.js'));

const localStoragePath = cliPaths.getLocalStoragePath();
const serverEnvNamePath = path.join(localStoragePath, 'server-env');

function getHostEnvName() {
  try {
    return fs.readFileSync(serverEnvNamePath, 'utf8');
  } catch (err) {
    return 'production';
  }
}

function setHostEnvName(name) {
  fs.writeFileSync(serverEnvNamePath, name);
}

module.exports.getHostEnvName = getHostEnvName;
module.exports.setHostEnvName = setHostEnvName;
