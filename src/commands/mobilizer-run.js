import { exec } from 'mz/child_process';
import { handleError } from '../extension/error-handler';
import * as platformManager from '../extension/platform-manager';
import { ensureUserIsLoggedIn } from './login';

export default async function (options) {
  try {
    await ensureUserIsLoggedIn();
    await platformManager.mobilizerRun({ ...options, path: process.cwd() });
  } catch (err) {
    await handleError(err);
  }
}
