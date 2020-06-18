require('yargonaut')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

import 'colors';
import 'fetch-everywhere';
import yargs from 'yargs';
import { version } from '../package.json';
import apiUrls from '../config/services';
import autoUpdate from './commands/update-cli';
import * as analytics from './services/analytics';
import { isAscii, containsSpace } from './services/validation';
import getHomeDir from './home-dir';
import { authorizeRequests, getRefreshToken } from './clients/auth-service';

const cliReferenceUrl = 'https://shoutem.github.io/docs/extensions/reference/cli';

const homeDir = getHomeDir();
if (!isAscii(homeDir) || containsSpace(homeDir)) {
  console.log(`ERROR: shoutem CLI homedir (currently \`${homeDir}\`) contains non-ascii characters or a space`.red.bold);
  console.log('Change it by setting SHOUTEM_CLI_HOME environmental variable'.red.bold);
  console.log(`Check ${cliReferenceUrl} for more info`.red.bold);
  process.exit(1);
}

analytics.setArgv(process.argv);

(async () => {
  if (await autoUpdate()) {
    return null;
  }
  await authorizeRequests(await getRefreshToken());

  const cli = yargs.usage('Usage: shoutem [command] [-h]')
    .option('version', {
      alias: 'v',
      description: 'Show version number'
    })
    .commandDir('cli')
    .strict()
    .help()
    .epilog(`If you don't have a developer account, you can register at ${apiUrls.appBuilder.bold}.\n\n` +
      `More detailed reference on how to use CLI can be found on the Developer Portal: ${cliReferenceUrl.bold}`)
    .alias('help', 'h');

  const argv = cli.argv;
  if (argv.version) {
    console.log(require('../package.json').version);
  } else if (argv._.length === 0) {
    cli.showHelp();
  }

  analytics.setCommandName(argv._[0]);
})();
