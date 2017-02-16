const path = require('path');
const fs = require('mz/fs');
const { generateExtensionJs } = require('../../build/src/extension/ext-js-generator');

module.exports = (localTemplatePath, destinationPath, { screenName }) => {
  const extPath = path.join(destinationPath, 'extension.json');

  return fs.readFile(extPath)
    .then(JSON.parse)
    .then(extJson => {
      extJson.screens = extJson.screens || [];
      extJson.screens.push({ name: screenName });
      return fs.writeFile(extPath, JSON.stringify(extJson, null, 2));
    })
    .then(() => generateExtensionJs(destinationPath))
    .then(() => ({ path: `app/screens/${screenName}.js`}));
};
