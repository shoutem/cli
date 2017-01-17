#!/usr/bin/env node
import 'babel-polyfill';
import yargs from 'yargs';
import { version } from '../package.json';
import { isLatest } from './extension/npmjs';
import apiUrls from '../config/services';
import msg from '../src/user_messages';

(async () => {
  if (await isLatest(apiUrls.cliAppUri, version)) {
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
  } else {
    console.log(msg.version.updateRequired());
  }
})();

