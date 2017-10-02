import { getHostEnvName } from '../clients/server-env';
import apisConfig from '../../config/services';
import msg from '../user_messages';
import { getValue } from '../services/cache-env';
import getHomeDir from '../home-dir';
import prettyJson from 'prettyjson';

export default async function(args) {
  const serverEnv = getHostEnvName();

  if (args.all || serverEnv !== 'production') {
    console.log(prettyJson.render({ [msg.use.show(serverEnv)]: apisConfig }));
  }

  const developer = await getValue('developer');
  if (developer) {
    console.log(msg.login.complete(developer));
  }

  console.log(`Home directory: \`${getHomeDir()}\` (customizable through SHOUTEM_CLI_HOME env variable, may require restart of terminal)`);
}
