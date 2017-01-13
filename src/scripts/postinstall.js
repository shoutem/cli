import 'babel-polyfill';
import os from 'os';
import path from 'path';
import rimraf from 'rmfr';

(async () => {
  const cliHome = path.join(os.homedir(), '.shoutem');

  await rimraf(path.join(cliHome, 'mobile-env'));
  await rimraf(path.join(cliHome, 'mobile-app'));
  await rimraf(path.join(cliHome, 'api-token'));
  await rimraf(path.join(cliHome, 'dev-info'));
  await rimraf(path.join(cliHome, 'last-error.json'));
})();
