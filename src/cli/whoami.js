import msg from '../user_messages';
import { getDeveloper } from '../commands/register';

export const command = 'whoami';
export const description = 'Username of the current user.';
export async function handler() {
  try {
    const dev = await getDeveloper();
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
