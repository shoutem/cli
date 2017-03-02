import { isLatest } from '../extension/npmjs';
import apiUrls from '../../config/services';
import msg from '../../src/user_messages';
import { spawn } from 'superspawn';
import { version } from '../../package.json';
import confirm from '../extension/confirmer';
import * as cache from '../extension/cache';
import 'colors';

async function confirmUpdate() {
  if (await cache.getValue('updateConfirmed') === false) {
    return false;
  }

  const updateConfirmed = await confirm(msg.version.updateRequired());
  await cache.setValue('updateConfirmed', false, 24 * 3600);

  return updateConfirmed;
}

export default async function () {
  if (await isLatest(apiUrls.cliAppUri, version)) {
    return false;
  }

  const updateConfirmed = await confirmUpdate();

  if (!updateConfirmed) {
    console.log('Warning: This is an outdated version of shoutem CLI'.bold.yellow);
    return false;
  }

  try {
    await spawn('npm', ['install', '-g', '@shoutem/cli'], { stdio: 'inherit' });
  } catch (err) {
    if (process.platform !== 'win32') {
      console.log('Current user does not have permissions to update shoutem CLI. Using sudo...');
      await spawn('sudo', ['npm', 'install', '-g', '@shoutem/cli'], { stdio: 'inherit' });
    } else {
      throw err;
    }
  }

  console.log('Update complete');
  await spawn('shoutem', process.argv.filter((_, index) => index > 1), { stdio: 'inherit' });

  return true;
}
