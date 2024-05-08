const decamelize = require('decamelize');
const _ = require('lodash');
const { getOrSet } = require('../../services/helpers');
const {
  instantiateExtensionTemplate,
} = require('../../services/extension-template');

function isHtmlPage({ type, path }) {
  return type === 'html' && !_.includes(path, 'server/build');
}

async function before(context) {
  const { extJson, name, extensionScope } = context;
  const pages = getOrSet(extJson, 'pages', []);

  if (!_.every(pages, isHtmlPage)) {
    throw new Error(
      "Html pages can't be mixed with non-html settings pages in the same extension",
    );
  }

  if (_.find(pages, { name })) {
    throw new Error(`Page ${name} already exists`);
  }

  const pageName = name;
  const pageDirectoryName = decamelize(name, '-');
  _.merge(context, { pageName, pageDirectoryName });

  pages.push({
    name: pageName,
    path: `server/pages/${pageDirectoryName}/index.html`,
    type: 'html',
  });

  if (extensionScope) {
    await instantiateExtensionTemplate('settings-page-html-extension', context);
  } else {
    await instantiateExtensionTemplate('settings-page-html-shortcut', context);
  }
}

module.exports = {
  before,
};
