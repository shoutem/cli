import * as platformManager from '../extension/platform-manager';
import selectApp from '../extension/app-selector';
import { ensureUserIsLoggedIn } from './login';

export default async function(platform, opts) {
  await ensureUserIsLoggedIn();
  opts.appId = opts.appId || await selectApp();

  await platformManager.nativeRun({ ...opts, platform });
}
