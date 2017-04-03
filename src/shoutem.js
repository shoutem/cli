#!/usr/bin/env node

const semver = require('semver');
const path = require('path');
const os = require('os');

const babelCachePath = path.join(os.homedir(), '.shoutem', 'cache', 'babel-cache');
process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;

require('babel-register')({
  presets: ['node7'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
