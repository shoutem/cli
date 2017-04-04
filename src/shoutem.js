#!/usr/bin/env node

const semver = require('semver');
const path = require('path');
const os = require('os');

if (semver.lt(process.versions.node, '7.0.0')) {
  console.error(`You appear to be using Node v${process.versions.node}, however, Node 7 or later is required`);
  return;
}

const babelCachePath = path.join(os.homedir(), '.shoutem', 'cache', 'babel-cache');
process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;

require('babel-register')({
  presets: ['node7'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
