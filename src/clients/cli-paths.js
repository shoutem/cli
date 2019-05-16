const fs = require('fs-extra');
const path = require('path');

const getHomeDir = require(path.resolve(__dirname, '../home-dir.js'));

function getLocalStoragePath() {
  const storagePath = getHomeDir();
  fs.ensureDirSync(storagePath);
  return storagePath;
}

module.exports.getLocalStoragePath = getLocalStoragePath;
