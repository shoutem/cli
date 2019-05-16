import authService from '../clients/auth-service';
import cache from '../services/cache-env';
import msg from '../user_messages';

export default function logout() {
  cache.setValue('developer', null);
  authService.clearTokens();
  console.log(msg.logout.complete());
}
