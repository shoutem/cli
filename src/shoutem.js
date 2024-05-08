#!/usr/bin/env node
require('@babel/register');

require('colors');
const path = require('path');
const semver = require('semver');
const packageJson = require('../package.json');
const getHomeDir = require('./home-dir');

const homeDir = getHomeDir();
const nodeVer = process.versions.node;
const cliArgs = process.argv.slice(2);

if (cliArgs[0] === '-v' || cliArgs[0] === '--version') {
  console.log(packageJson.version);
  process.exit(0);
}

if (!path.isAbsolute(homeDir)) {
  console.log(`ERROR: path ${homeDir} is not an absolute path.`.red);
  console.log(
    'Please set your SHOUTEM_CLI_HOME environmental variable to an absolute path.'
      .red,
  );
  process.exit(1);
}

if (semver.lt(nodeVer, '6.0.0')) {
  console.error(
    `You appear to be using Node v${nodeVer}, however, Node 6 or later is required.`,
  );
  process.exit(1);
}

const babelCachePath = path.join(homeDir, 'cache', 'babel-cache');
process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;

require('./cli');
