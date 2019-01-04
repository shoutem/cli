import { clearTokens } from '../clients/auth-service';
import cache from '../services/cache-env';
import msg from '../user_messages';

export default function logout() {
  cache.setValue('developer', null);
  clearTokens();
  console.log(msg.logout.complete());
}
