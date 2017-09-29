import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';
import decamelize from "decamelize";
import pascalize from 'uppercamelcase';
import {instantiateExtensionTemplate} from "../../services/extension-template";

function isReactPage({ type, path }) {
  return type === 'react-page' || _.includes(path, 'server/build');
}

export async function before(context) {
  const { extJson, name } = context;

  const pages = getOrSet(extJson, 'pages', []);

  if (_.find(pages, { name })) {
    throw new Error(`Page ${name} already exists`);
  }

  if (!_.every(pages, isReactPage)) {
    throw new Error("React pages can't be mixed with non-react settings pages");
  }

  pages.push({ name, type: 'react-page' });

  const pageDirectoryName = decamelize(name, '-');
  const pageClassName = pascalize(name);
  _.merge(context, { pageDirectoryName, pageClassName });
}

export async function after(context) {
  return await instantiateExtensionTemplate('settings-page-react-bin', context, { overwrite: () => true });
}
