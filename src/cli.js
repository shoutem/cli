require('yargonaut')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

import 'colors';
import yargs from 'yargs';
import { version } from '../package.json';
import apiUrls from '../config/services';
import autoUpdate from './commands/update-cli';

(async () => {
  if (await autoUpdate()) {
    return null;
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
