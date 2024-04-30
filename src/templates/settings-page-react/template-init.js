const decamelize = require('decamelize');
const _ = require('lodash');
const pascalize = require('uppercamelcase');
const { getOrSet } = require('../../services/helpers');
const {
  instantiateExtensionTemplate,
} = require('../../services/extension-template');

function isReactPage({ type, path }) {
  return type === 'react-page' || _.includes(path, 'server/build');
}

async function before(context) {
  const { extJson, name } = context;

  const pages = getOrSet(extJson, 'pages', []);

  if (_.find(pages, { name })) {
    throw new Error(`Page ${name} already exists`);
  }

  if (!_.every(pages, isReactPage)) {
    throw new Error(
      "React pages can't be mixed with non-react settings pages in the same extension",
    );
  }

  pages.push({ name, type: 'react-page' });

  const pageDirectoryName = decamelize(name, '-');
  const pageClassName = pascalize(name);
  _.merge(context, { pageDirectoryName, pageClassName });
}

async function after(context) {
  if (context.extensionScope) {
    await instantiateExtensionTemplate(
      'settings-page-react-extension',
      context,
    );
  } else {
    await instantiateExtensionTemplate('settings-page-react-shortcut', context);
  }
  await instantiateExtensionTemplate('settings-page-react-bin', context);
}

module.exports = {
  before,
  after,
  isReactPage,
};
