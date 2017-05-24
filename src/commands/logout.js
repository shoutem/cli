import * as cache from '../extension/cache-env';
import { clearTokens } from '../clients/auth-service';
import msg from '../user_messages';

export default async function logout() {
  await cache.setValue('developer', null);
  await clearTokens();
  console.log(msg.logout.complete());
}
