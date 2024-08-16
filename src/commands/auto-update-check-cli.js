import * as cache from '../services/cache';
import updateCli from './update-cli';

const AUTO_UPDATE_CHECK_CLI_CACHE_KEY = 'auto-update-check-cli';

export async function autoUpdateCheckCli(opts) {
  if (opts.enable) {
    await cache.setValue(AUTO_UPDATE_CHECK_CLI_CACHE_KEY, true);
    return;
  }

  if (opts.disable) {
    await cache.setValue(AUTO_UPDATE_CHECK_CLI_CACHE_KEY, false);
    return;
  }

  // set auto update to true if no params were set
  await cache.setValue(AUTO_UPDATE_CHECK_CLI_CACHE_KEY, true);
}

export async function autoUpdate() {
  const shouldAutoUpdate = await cache.getValue(
    AUTO_UPDATE_CHECK_CLI_CACHE_KEY,
  );

  if (shouldAutoUpdate === false) {
    return false;
  }

  return await updateCli();
}
