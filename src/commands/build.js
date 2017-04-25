import selectApp from '../extension/app-selector';
import { build } from '../extension/platform-manager';

export default async function(platform, opts) {
  opts.appId = opts.appId || await selectApp();

  await build(platform, opts, process.cwd());
}
