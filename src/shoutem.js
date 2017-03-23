#!/usr/bin/env node

const semver = require('semver');

const presets = [];
const plugins = ['transform-object-rest-spread', 'transform-async-to-generator'];

if (semver.lt(process.versions.node, '6.0.0')) {
  presets.push('full-node4');
} else if (semver.lt(process.versions.node, '7.0.0')) {
  presets.push('node6');
} else {
  presets.push('node7');
}

require('babel-register')({
  presets,
  plugins,
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
