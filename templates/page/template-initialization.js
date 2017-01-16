const path = require('path');
const fs = require('mz/fs');

module.exports = (templatePath, extensionPath, templateVars) => {
  const extPath = path.join(extensionPath, 'extension.json');
  const pageName = templateVars.pageName;

  return fs.readFile(extPath)
    .then(JSON.parse)
    .then(extJson => {
      extJson.pages = extJson.pages || [];
      extJson.pages.push({
        name: pageName,
        path: `server/pages/${pageName}/index.html`
      });
      return fs.writeFile(extPath, JSON.stringify(extJson, null, 2));
    })
    .then(() => ({ path: `server/pages/${pageName}`}));
};
