#!/usr/bin/env node
require('babel-register')({
  presets: ['node6'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  sourceMaps: true,
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
