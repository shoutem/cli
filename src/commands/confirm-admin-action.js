import { ensureDeveloperIsRegistered } from '../commands/register';
import confirm from '../extension/confirmer';
import { getHostEnvName } from '../clients/server-env';

export default async function(msg) {
  const dev = await ensureDeveloperIsRegistered();

  if (getHostEnvName() !== 'production' || dev.name !== 'shoutem') {
    return true;
  }

  return await confirm(msg, { default: false });
}
