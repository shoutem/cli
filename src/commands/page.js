import mkdirp from 'mkdirp-promise';
import path from 'path';
import _ from 'lodash';
import {
  loadExtensionJsonAsync,
  saveExtensionJsonAsync,
  ensureInExtensionDir,
} from '../extension/data';
import { createTemplateIfNotExists } from '../extension/template';

export async function createPage(pageName) {
  ensureInExtensionDir();

  const dirPath = path.join('server', 'pages');
  await mkdirp(dirPath);

  const filePath = path.join(dirPath, `${pageName}.js`);
  const template = await createTemplateIfNotExists(
    './page/page.js.template',
    { pageClassName: pageName },
    filePath
  );

  const extensionJson = await loadExtensionJsonAsync();
  const pages = extensionJson.pages || [];
  const pagesNames = pages.map(page => page.name);
  if (!_.includes(pagesNames, pageName)) {
    pages.push({ name: pageName });
  }
  extensionJson.pages = pages;
  await saveExtensionJsonAsync(extensionJson);

  return { template, path: filePath };
}
