import { execSync } from 'child_process';
import 'colors';

import msg from '../user_messages';
import { version } from '../../package.json';
import apiUrls from '../../config/services';

import cache from '../services/cache';
import confirm from '../services/confirmer';
import { isLatest } from '../services/npmjs';
import { spinify } from '../services/spinner';

async function confirmUpdate() {
  if (cache.getValue('updateConfirmed') === false) {
    return false;
  }

  const message = msg.version.updateRequired();
  const updateConfirmed = await confirm(message);

  cache.setValue('updateConfirmed', false, 24 * 3600);

  return updateConfirmed;
}

export default async function () {
  if (await spinify(isLatest(apiUrls.cliAppUri, version), 'Checking for CLI update...')) {
    return false;
  }

  const updateConfirmed = await confirmUpdate();

  if (!updateConfirmed) {
    console.log('Warning: This is an outdated version of shoutem CLI'.bold.yellow);
    console.log('Install the new one with: `npm install -g @shoutem/cli`. You might need to run it with `sudo` prefix.'.yellow);
    return false;
  }

  const options = { stdio: 'inherit' };

  try {
    execSync('npm install -g @shoutem/cli', options);
  } catch (err) {
    if (process.platform !== 'win32') {
      console.log('Current user does not have permissions to update shoutem CLI. Using sudo...');
      execSync('sudo npm install -g @shoutem/cli', options);
    } else {
      throw err;
    }
  }

  console.log('Update complete');

  execSync('shoutem', process.argv.slice(2), options);

  return true;
}
