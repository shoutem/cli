import { getHostEnvName } from '../clients/server-env';
import confirm from '../services/confirmer';
import { ensureUserIsLoggedIn } from './login';

export default async function (msg) {
  const dev = await ensureUserIsLoggedIn();

  if (getHostEnvName() !== 'production' || dev.name !== 'shoutem') {
    return true;
  }

  return confirm(msg, { default: false });
}
