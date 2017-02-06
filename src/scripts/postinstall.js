import 'babel-polyfill';
import os from 'os';
import path from 'path';
import rimraf from 'rmfr';
import { spawn } from 'superspawn';

(async () => {
  const cliHome = path.join(os.homedir(), '.shoutem');

  try {
    await Promise.all([
      rimraf(path.join(cliHome, 'mobile-env')),
      rimraf(path.join(cliHome, 'mobile-app')),
      rimraf(path.join(cliHome, 'api-token')),
      rimraf(path.join(cliHome, 'dev-info')),
      rimraf(path.join(cliHome, 'last-error.json')),

      rimraf(path.join(cliHome, 'dev/app')),
      rimraf(path.join(cliHome, 'qa/app')),
      rimraf(path.join(cliHome, 'production/app')),
      rimraf(path.join(cliHome, 'beta/app')),
      rimraf(path.join(cliHome, 'local/app')),
    ]);
  } catch (err) {
  }
})();
