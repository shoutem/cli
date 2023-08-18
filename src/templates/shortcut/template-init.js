const { addShortcut } = require('../../services/shortcut');

async function before(context) {
  addShortcut(context.extJson, context);
}

module.exports = {
  before,
};
