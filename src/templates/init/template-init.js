const path = require('path');
require('colors');

async function before(context) {
  const { devName, extJson, extensionPath } = context;
  context.extensionPath = path.join(
    extensionPath,
    `${devName}.${extJson.name}`,
  );
}

module.exports = {
  before,
};
