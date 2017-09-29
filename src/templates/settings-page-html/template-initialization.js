import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';

function isHtmlPage({ type, path }) {
   return type === 'html' && !_.includes(path, 'server/build');
}

export async function before({ extJson, name }) {
  const pages = getOrSet(extJson, 'pages', []);

  if (!_.every(pages, isHtmlPage)) {
    throw new Error("Html pages can't be mixed with non-html settings pages");
  }

  if (_.find(pages, { name })) {
    throw new Error(`Page ${name} already exists`);
  }

  pages.push({
    name: name,
    path: `server/pages/${name}/index.html`,
    type: 'html'
  });
}
