import * as platformManager from '../extension/platform-manager';
import selectApp from '../extension/app-selector';

export default async function(platform, opts) {
  opts.appId = opts.appId || await selectApp();

  await platformManager.nativeRun({ ...opts, platform });
}
