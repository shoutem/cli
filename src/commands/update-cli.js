import { isLatest } from '../services/npmjs';
import apiUrls from '../../config/services';
import msg from '../user_messages';
import { spawn } from 'child-process-promise';
import { version } from '../../package.json';
import { getDefaultPackageManager } from '../clients/default-package-manager';
import confirm from '../services/confirmer';
import * as cache from '../services/cache';
import { spinify } from '../services/spinner';
import 'colors';

const packageManager = getDefaultPackageManager();

async function confirmUpdate() {
  if ((await cache.getValue('updateConfirmed')) === false) {
    return false;
  }

  const updateConfirmed = await confirm(msg.version.updateRequired());
  await cache.setValue('updateConfirmed', false, 24 * 3600);

  return updateConfirmed;
}

export default async function() {
  if (
    await spinify(
      isLatest(apiUrls.cliAppUri, version),
      'Checking for CLI update...',
    )
  ) {
    return false;
  }

  const updateConfirmed = await confirmUpdate();

  if (!updateConfirmed) {
    console.log(
      'Warning: This is an outdated version of the Shoutem CLI.'.bold.yellow,
    );
    console.log(
      `Install the new one with: 'npm install -g @shoutem/cli' or 'yarn global add @shoutem/cli'. You might need to run it with 'sudo' prefix.`
        .yellow,
    );
    return false;
  }

  try {
    if (packageManager === 'npm') {
      await spawn(packageManager, ['install', '-g', '@shoutem/cli'], {
        stdio: 'inherit',
      });
    } else {
      await spawn(packageManager, ['global', 'add', '@shoutem/cli'], {
        stdio: 'inherit',
      });
    }
  } catch (err) {
    if (process.platform !== 'win32') {
      console.log(
        'Current user does not have permissions to update Shoutem CLI. Using sudo...',
      );
      if (packageManager === 'npm') {
        await spawn('sudo', [packageManager, 'install', '-g', '@shoutem/cli'], {
          stdio: 'inherit',
        });
      } else {
        await spawn('sudo', [packageManager, 'global', 'add', '@shoutem/cli'], {
          stdio: 'inherit',
        });
      }
    } else {
      throw err;
    }
  }

  console.log('Update complete.');
  await spawn(
    'shoutem',
    process.argv.filter((_, index) => index > 1),
    { stdio: 'inherit' },
  );

  return true;
}
