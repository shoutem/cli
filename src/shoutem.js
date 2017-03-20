#!/usr/bin/env node --harmony
const semver = require('semver');

const plugins = ['transform-object-rest-spread'];
if (semver.lt(process.versions.node, '7.0.0')) {
  plugins.push('transform-async-to-generator');
}

require('babel-register')({
  presets: ['node6'],
  plugins,
  sourceMaps: true,
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
