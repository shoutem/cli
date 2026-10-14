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

// The update check ends in an inquirer prompt, which can't be answered on CI or
// with redirected input: without a terminal it crashes the command
// (ERR_USE_AFTER_CLOSE) before it runs. Build machines also install a pinned
// CLI version on purpose, so the check is skipped there.
function isInteractive() {
  const { CI } = process.env;
  const isCi = !!CI && CI !== 'false' && CI !== '0';

  return !isCi && !!process.stdin.isTTY && !!process.stdout.isTTY;
}

export async function autoUpdate() {
  if (!isInteractive()) {
    return false;
  }

  const shouldAutoUpdate = await cache.getValue(
    AUTO_UPDATE_CHECK_CLI_CACHE_KEY,
  );

  if (shouldAutoUpdate === false) {
    return false;
  }

  return await updateCli();
}
