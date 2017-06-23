import { exec } from 'mz/child_process';
import { handleError } from '../extension/error-handler';
import * as platformManager from '../extension/platform-manager';
import { ensureUserIsLoggedIn } from './login';
import commandExists from '../extension/command-exists';

export default async function (options) {
  try {
    await ensureUserIsLoggedIn();
    await platformManager.mobilizerRun({ ...options, path: process.cwd() });
  } catch (err) {
    if (!/^win/.test(process.platform) && !await commandExists('watchman')) {
      console.log('HINT: You should probably install Facebook\'s `watchman` before running `shoutem run` command'.bold.yellow);
    }
    await handleError(err);
  }
}
