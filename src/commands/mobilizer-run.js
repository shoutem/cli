import { exec } from 'mz/child_process';
import { handleError } from '../extension/error-handler';
import selectApp from '../extension/app-selector';
import * as platformManager from '../extension/platform-manager';
import { ensureUserIsLoggedIn } from './login';

export default async function (options) {
  try {
    await ensureUserIsLoggedIn();
    options.appId = options.appId || await selectApp();
    options.path = process.cwd();
    await platformManager.mobilizerRun(options);
  } catch (err) {
    await handleError(err);
  }
}
