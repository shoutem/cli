import 'colors';
import prettyJson from 'prettyjson';
import * as cache from '../services/cache-env';

export const description = null;
export const command = 'last-error';
export async function handler() {
  const lastError = await cache.getValue('last-error');
  if (lastError) {
    console.log(prettyJson.render(lastError, {
      keysColor: 'cyan',
      numberColor: 'white',
    }));
    console.log('\nIf you think this error is caused by a bug in the @shoutem/cli, you can report the issue here: "https://github.com/shoutem/cli/issues"'.yellow);
  } else {
    console.log('No error.'.green);
  }
}
