require('yargonaut')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

import 'colors';
import yargs from 'yargs';
import { version } from '../package.json';
import apiUrls from '../config/services';
import autoUpdate from './commands/update-cli';
import * as analytics from './services/analytics';
import { isAscii, containsSpace } from './services/validation';
import getHomeDir from './home-dir';
import { authorizeRequests, getRefreshToken } from './clients/auth-service';

const cliReferenceUrl =
  'https://shoutem.github.io/docs/extensions/reference/cli';

const homeDir = getHomeDir();
if (!isAscii(homeDir) || containsSpace(homeDir)) {
  console.log(
    `ERROR: shoutem CLI homedir (currently \`${homeDir}\`) contains non-ascii characters or a space`
      .red.bold,
  );
  console.log(
    'Change it by setting SHOUTEM_CLI_HOME environmental variable'.red.bold,
  );
  console.log(`Check ${cliReferenceUrl} for more info`.red.bold);
  process.exit(1);
}

analytics.setArgv(process.argv);

(async () => {
  if (await autoUpdate()) {
    return;
  }
  await authorizeRequests(await getRefreshToken());

  const { hideBin } = require('yargs/helpers')

  const cli = yargs(process.argv.splice(2))
    .usage('Usage: shoutem [command] [-h]')
    .version()
    .commandDir('cli')
    .strict()
    .help()
    .epilog(
      `If you don't have a developer account, you can register at ${apiUrls.appBuilder.bold}.\n\n` +
        `A more detailed reference on how to use CLI can be found on the Developer Portal: ${cliReferenceUrl.bold}.`,
    )
    .alias('help', 'h');

  const argv = cli.argv;
  if (argv.length === 0) {
    cli.showHelp();
  }

  analytics.setCommandName(argv[0]);
})();
