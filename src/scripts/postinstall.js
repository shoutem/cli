import 'babel-polyfill';
import os from 'os';
import path from 'path';
import rimraf from 'rmfr';
import { spawn } from 'superspawn';

(async () => {

  // platform-build requires write permission while client is built
  if (process.platform !== 'win32' && process.env.SUDO_UID) {
    const platformBuildPath = path.join(__dirname, '..', '..', '..', 'node_modules', '@shoutem', 'platform-build');
    await spawn('chmod', ['-R', '0777', platformBuildPath], { stdio: 'inherit' });
  }

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
