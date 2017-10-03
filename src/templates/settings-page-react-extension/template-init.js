import getOrSet from 'lodash-get-or-set';

export async function before(context) {
  const { extJson, name, title } = context;

  getOrSet(extJson, 'settingsPages', [])
    .push({ page: `@.${name}`, title });
}
