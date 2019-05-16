import msg from '../user_messages';
import cache from '../services/cache-env';

export const command = 'whoami';
export const description = 'Username of the current user.';

export function handler() {
  try {
    const dev = cache.getValue('developer');
    if (dev) {
      console.log(msg.login.complete(dev));
    } else {
      console.log('Not logged in. Try using `shoutem login`');
    }
  } catch (err) {
    console.log(err.message || err);
  }
}

export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
