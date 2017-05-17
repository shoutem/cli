import inquirer from 'inquirer';
import { authorizeRequests, refreshTokenExists} from '../clients/auth-service';
import msg from '../user_messages';
import urls from '../../config/services';

function promptUserCredentials() {
  console.log(msg.login.credentialsPrompt(urls.appBuilder));
  const questions = [{
    name: 'email',
    message: 'Email',
  }, {
    name: 'password',
    message: 'Password',
    type: 'password',
  }];

  return inquirer.prompt(questions);
}

/**
 * Asks user to enter credentials, verifies those credentials with authentication
 * service, and saves the received API token locally for further requests.
 */
export async function loginUser() {
  await authorizeRequests(await promptUserCredentials());
}

/**
 * Asks user for email and password if refreshToken is not already cached
 * @param shouldThrow Should an error be thrown if user is not logged in or should user be asked for credentials
 */
export async function ensureUserIsLoggedIn(shouldThrow = false) {
  if (!await refreshTokenExists()) {
    if (shouldThrow) {
      throw new Error('Not logged in, use `shoutem login` command to login');
    } else {
      await loginUser();
    }
  }
}
