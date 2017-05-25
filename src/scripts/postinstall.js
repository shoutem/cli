const os =  require('os');
const path = require('path');
const rimraf = require('rmfr');
const getHomeDir = require('../home-dir');


const cliHome = getHomeDir();

Promise.all([
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

  rimraf(path.join(cliHome, 'platforms')),
  rimraf(path.join(cliHome, '*/client/build-config.json'), { glob: true }),
  rimraf(path.join(cliHome, 'last-error.json'))
]).catch(err => {});
