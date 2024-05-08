const _ = require('lodash');
const { getOrSet } = require('../../services/helpers');
const shortcut = require('../../services/shortcut');

async function before(context) {
  const { extJson, name } = context;

  const screens = getOrSet(extJson, 'screens', []);

  if (_.find(screens, { name })) {
    throw new Error(`Screen ${name} already exists`);
  }

  screens.push({ name });

  _.merge(context, {
    screenName: name,
    screenClassName: name,
  });

  if (context.newShortcut) {
    shortcut.addShortcutForScreen(extJson, context, context.newShortcut);
  }
}

module.exports = {
  before,
};
