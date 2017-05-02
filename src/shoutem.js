#!/usr/bin/env node

const semver = require('semver');
const path = require('path');
const os = require('os');
import getHomeDir from './home-dir';

if (semver.lt(process.versions.node, '6.0.0')) {
  console.error(`You appear to be using Node v${process.versions.node}, however, Node 6 or later is required`);
  return;
}

const babelCachePath = path.join(getHomeDir(), 'cache', 'babel-cache');
process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;

require('babel-register')({
  presets: [semver.lt(process.versions.node, '7.0.0') ? 'node6' : 'node7'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
