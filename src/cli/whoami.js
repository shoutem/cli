import msg from '../user_messages';
import { getValue } from '../services/cache-env';

export const command = 'whoami';
export const description = "Displays the current user's username.";
export async function handler() {
  try {
    const dev = await getValue('developer');
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
