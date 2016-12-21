#!/usr/bin/env node
import 'babel-polyfill';
import yargs from 'yargs';

const argv = yargs.usage('Usage: shoutem [command] [-h]')
  .version()
  .commandDir('cli')
  .demand(1)
  .strict()
  .help()
  .epilog('If you don\'t have a developer account, you can register @ shoutem.com')
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;
