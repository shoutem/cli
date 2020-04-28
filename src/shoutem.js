#!/usr/bin/env node
const semver = require('semver');
const path = require('path');
require('colors');

const getHomeDir = require('./home-dir');
const packageJson = require('../package.json');

const homeDir = getHomeDir();
const nodeVer = process.versions.node;
const cliArgs = process.argv.slice(2);

if (cliArgs[0] === '-v' || cliArgs[0] === '--version') {
  console.log(packageJson.version);
  process.exit(0);
}

if (!path.isAbsolute(homeDir)) {
  console.log(`ERROR: path ${homeDir} is not an absolute path.`.red);
  console.log('Please set your SHOUTEM_CLI_HOME environmental variable to an absolute path'.red);
  process.exit(1);
}

if (semver.lt(nodeVer, '6.0.0')) {
  console.error(`You appear to be using Node v${nodeVer}, however, Node 6 or later is required`);
  process.exit(1);
}

process.env.SHOUTEM_CLI_DIRNAME = path.basename(__dirname);

if (process.env.SHOUTEM_CLI_DIRNAME === 'src') {
  const babelCachePath = path.join(homeDir, 'cache', 'babel-cache');
  process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;
  require('babel-register')(packageJson.babel);
}

require('./cli');
