#!/usr/bin/env node --harmony-async-await

require('babel-register')({
  presets: ['node6'],
  plugins: ['transform-object-rest-spread'],
  sourceMaps: true,
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli.js');
