import _ from 'lodash';
import { loadExtensionJsonAsync } from '../src/extension/data';

export default async function (localTemplatePath, extensionPath, { themeName }) {
  const extJson = await loadExtensionJsonAsync(extensionPath) || {};
  const names = (extJson.themes || []).map(theme => theme.name);

  if (_.includes(names, themeName)) {
    throw new Error(`Theme \`${themeName}\` already exists. Pick another name.`);
  }


}

