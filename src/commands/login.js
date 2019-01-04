import inquirer from 'inquirer';
import _ from 'lodash';
import { authorizeRequests, getRefreshToken } from '../clients/auth-service';
import { getDeveloper, createDeveloper } from '../clients/extension-manager';
import msg from '../user_messages';
import urls from '../../config/services';
import * as logger from '../services/logger';
import * as cache from '../services/cache-env';

async function resolveCredentials(args) {
  if (args.credentials) {
    return parseCredentials(args.credentials);
  }

  return await promptUserCredentials(args);
}

function parseCredentials(credentials) {
  const parts = credentials.split(':');

  return {
    email: _.get(parts, '[0]'),
    password: _.get(parts, '[1]'),
  };
}

function promptUserCredentials(args = {}) {
  if (!args.email || !args.password) {
    console.log(msg.login.credentialsPrompt(urls.appBuilder));
  }

  const questions = [{
    name: 'email',
    message: 'Email',
    when: () => !args.email,
  }, {
    name: 'password',
    message: 'Password',
    type: 'password',
    when: () => !args.password,
  }];

  return inquirer.prompt(questions);
}

function promptDeveloperName() {
  /* eslint no-confusing-arrow: 0 */
  console.log('Enter developer name.');

  return inquirer
    .prompt({
      name: 'devName',
      message: 'Developer name',
      validate() {
        return value ? true : 'Developer name cannot be blank.';
      },
    })
    .then(answer => answer.devName);
}

/**
 * Asks user to enter credentials, verifies those credentials with authentication
 * service, and saves the received API token locally for further requests.
 */
export async function loginUser(args) {
  const credentials = await resolveCredentials(args);
  const refreshToken = await getRefreshToken(credentials);
  let developer = null;

  authorizeRequests(refreshToken);

  try {
    developer = await getDeveloper();
  } catch (err) {
    if (err.statusCode === 404) {
      developer = await createDeveloper(await promptDeveloperName());
    } else {
      throw err;
    }
  }

  console.log(msg.login.complete(developer));

  logger.info('logged in as developer', developer);

  return cache.setValue('developer', { ...developer, email: credentials.email });
}

/**
 * Asks user for email and password if refreshToken is not already cached
 * @param shouldThrow Should an error be thrown if user is not logged in or should user be asked for credentials
 */
export async function ensureUserIsLoggedIn(shouldThrow = false) {
  const developer = cache.getValue('developer');

  if (developer) {
    return developer;
  }

  if (shouldThrow) {
    throw new Error('Not logged in, use `shoutem login` command to login');
  }

  return await loginUser();
}
