import _ from 'lodash';
import getOrSet from 'lodash-get-or-set';

export async function before({ title, themeName, description, extJson }) {
  const themes = getOrSet(extJson, 'themes', []);
  if (_.find(themes, { name: themeName })) {
    throw new Error(`Theme \`${themeName}\` already exists. Pick another name.`);
  }
  themes.push({
    title,
    description,
    name: themeName,
    showcase: [],
    variables: `@.${themeName}Variables`,
  });

  getOrSet(extJson, 'themeVariables', [])
    .push({
      name: `${themeName}Variables`,
      path: `./server/themes/${themeName}Variables.json`,
    });

  return [
    `app/themes/${themeName}.js`,
    `server/themes/${themeName}Variables.js`
  ];
}
