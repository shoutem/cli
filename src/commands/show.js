/* eslint no-console: "off" */
import { loadMobileConfig, unlinkDeletedWorkingDirectories } from '../clients/mobile-env';
import { getHostEnvName } from '../clients/server-env';
import apisConfig from '../../config/services';
import msg from '../user_messages';
import { getDeveloper } from '../commands/register';

export default async function() {
  await unlinkDeletedWorkingDirectories();

  const serverEnv = getHostEnvName();

  if (serverEnv !== 'production') {
    console.log(msg.use.show(serverEnv));
    console.log(apisConfig);
  }

  const config = await loadMobileConfig() || {};
  const extDirs = config.workingDirectories || [];

  if (extDirs.length === 0) {
    console.log(msg.show.missingExtensions());
  } else {
    console.log(msg.show.listExtensions(extDirs));
  }

  const developer = await getDeveloper();
  if (developer) {
    console.log(msg.login.complete(developer));
  }
}
