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
      numberColor: 'white'
    }));
  } else {
    console.log('No error'.green);
  }
}
