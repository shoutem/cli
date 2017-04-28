import { exec } from 'mz/child_process';
import { handleError } from '../extension/error-handler';
import selectApp from '../extension/app-selector';
import * as platformManager from '../extension/platform-manager';

export default async function (options) {
  try {
    options.appId = options.appId || await selectApp();
    await platformManager.mobilizerRun(options);
  } catch (err) {
    await handleError(err);
  }
}
