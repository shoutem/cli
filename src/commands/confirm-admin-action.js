import { ensureUserIsLoggedIn } from '../commands/login';
import confirm from '../services/confirmer';
import { getHostEnvName } from '../clients/server-env';

export default async function(msg) {
  const dev = await ensureUserIsLoggedIn();

  if (getHostEnvName() !== 'production' || dev.name !== 'shoutem') {
    return true;
  }

  return confirm(msg, { default: false });
}
