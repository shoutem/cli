import inquirer from 'inquirer';
import { authorizeRequests, getRefreshToken } from '../clients/auth-service';
import { getDeveloper, createDeveloper } from '../clients/extension-manager';
import msg from '../user_messages';
import urls from '../../config/services';
import * as logger from '../extension/logger';
import * as cache from '../extension/cache-env';

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

function promptDeveloperName() {
  /* eslint no-confusing-arrow: 0 */
  console.log('Enter developer name.');
  return inquirer.prompt({
    name: 'devName',
    message: 'Developer name',
    validate: value => value ? true : 'Developer name cannot be blank.',
  }).then(answer => answer.devName);
}

/**
 * Asks user to enter credentials, verifies those credentials with authentication
 * service, and saves the received API token locally for further requests.
 */
export async function loginUser() {
  const credentials = await promptUserCredentials();
  const refreshToken = await getRefreshToken(credentials);
  let developer = null;

  try {
    developer = await getDeveloper();
  } catch (err) {
    if (err.statusCode === 404) {
      developer = await createDeveloper(await promptDeveloperName());
    } else {
      throw err;
    }
  }

  await authorizeRequests(refreshToken);

  console.log(msg.login.complete(developer));
  logger.info('logged in as developer', developer);

  return cache.setValue('developer', { developer, email: credentials.email, refreshToken });
}

/**
 * Asks user for email and password if refreshToken is not already cached
 * @param shouldThrow Should an error be thrown if user is not logged in or should user be asked for credentials
 */
export async function ensureUserIsLoggedIn(shouldThrow = false) {
  const developer = await cache.getValue('developer');
  if (developer) {
    return developer;
  }

  if (shouldThrow) {
    throw new Error('Not logged in, use `shoutem login` command to login');
  } else {
    return await loginUser();
  }
}
