#!/usr/bin/env node
import 'babel-polyfill';

require('yargonaut')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

import 'colors';
import yargs from 'yargs';
import { version } from '../package.json';
import { isLatest } from './extension/npmjs';
import apiUrls from '../config/services';
import msg from '../src/user_messages';
import { spawn } from 'superspawn';

(async () => {
  if (!await isLatest(apiUrls.cliAppUri, version)) {
    console.log(msg.version.updateRequired());
    try {
      await spawn('npm', ['install', '-g', '@shoutem/cli']);
    } catch (err) {
      if (process.platform !== 'win32') {
        console.log('Current user does not have permissions to update shoutem CLI. Using sudo...');
        await spawn('sudo', ['npm', 'install', '-g', '@shoutem/cli'], { stdio: 'inherit' });
      } else {
        throw err;
      }
    }
    console.log('Update complete');
    return spawn('shoutem', process.argv.filter((_, index) => index > 1), { stdio: 'inherit' });
  }

  const cli = yargs.usage('Usage: shoutem [command] [-h]')
    .option('version', {
      alias: 'v',
      description: 'Show version number'
    })
    .commandDir('cli')
    .strict()
    .help()
    .epilog(`If you don't have a developer account, you can register at ${apiUrls.appBuilder.bold}.\n\n`+
    `More detailed reference on how to use CLI can be found on the Developer Portal: ${"https://shoutem.github.io/docs/extensions/reference/cli".bold}`)
    .alias('help', 'h');

  const argv = cli.argv;
  if (argv.version) {
    console.log(require('../package.json').version);
  } else if (argv._.length === 0){
    cli.showHelp();
  }
})();
