import { ensureDeveloperIsRegistered } from '../commands/register';
import confirm from '../extension/confirmer';

export default async function(msg) {
  const dev = await ensureDeveloperIsRegistered();

  if (dev.name !== 'shoutem') {
    return true;
  }

  return await confirm(msg, { default: false });
}
