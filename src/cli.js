import 'colors';
import 'fetch-everywhere';
import yargs from 'yargs';

import getHomeDir from './home-dir';
import autoUpdate from './commands/update-cli';
import * as analytics from './services/analytics';
import { isAscii, containsSpace } from './services/validation';
import { authorizeRequests, getRefreshToken } from './clients/auth-service';
import apiUrls from '../config/services';

require('yargonaut')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

const homeDir = getHomeDir();
const cliReferenceUrl = 'https://shoutem.github.io/docs/extensions/reference/cli';
const cliArgs = process.argv.slice(2);

if (!isAscii(homeDir) || containsSpace(homeDir)) {
  console.log(`ERROR: shoutem CLI homedir (currently \`${homeDir}\`) contains non-ascii characters or a space`.red.bold);
  console.log('Change it by setting SHOUTEM_CLI_HOME environmental variable'.red.bold);
  console.log(`Check ${cliReferenceUrl} for more info`.red.bold);
  process.exit(1);
}

analytics.setArgv(process.argv);

(async () => {
  if (await autoUpdate(cliArgs)) {
    return null;
  }
  const refreshToken = await getRefreshToken();
  authorizeRequests(refreshToken);

  const cli = yargs.usage('Usage: shoutem [command] [-h]')
    .option('version', {
      alias: 'v',
      description: 'Show version number',
    })
    .commandDir('cli') // takes over a second to go through all the files in the 'commands' dir
    .strict()
    .help()
    .epilog(`If you don't have a developer account, you can create one at ${apiUrls.appBuilder.bold}.\n\n` +
      `A more detailed reference on how to use Shoutem CLI can be found on the Developer Portal: ${cliReferenceUrl.bold}`)
    .alias('help', 'h');

  const { argv } = cli;

  if (argv._.length === 0) {
    cli.showHelp();
  }

  analytics.setCommandName(argv._[0]);
})();
