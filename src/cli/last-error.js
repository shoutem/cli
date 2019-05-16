import 'colors';
import prettyJson from 'prettyjson';

import cache from '../services/cache-env';

export const description = null;
export const command = 'last-error';

export function handler() {
  const lastError = cache.getValue('last-error');

  if (lastError) {
    console.log(prettyJson.render(lastError, {
      keysColor: 'cyan',
      numberColor: 'white',
    }));

    console.log(`\nIf you think this error is caused by a bug in the Shoutem CLI, please report the issue here: ${'https://github.com/shoutem/cli/issues'.bold}`.yellow);
  } else {
    console.log('No error'.green);
  }
}
