/* eslint no-console: 0 */
import _ from 'lodash';
import inquirer from 'inquirer';
import { instantiateTemplatePath } from '../extension/template';
import { ensureDeveloperIsRegistered } from './register';
import msg from '../user_messages';
import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureUserIsLoggedIn } from './login'
import * as utils from '../extension/data';

export function cwd() {
  return process.cwd();
}

function generateNoPatchSemver(version) {
  const [a, b] = version.split('.');
  return [a, b, '*'].join('.');
}

export async function promptExtensionInit(extName) {
  /* eslint no-confusing-arrow: 0 */
  /* eslint no-param-reassign: 0 */
  const name = _.kebabCase(extName);
  const title = _.upperFirst(extName.toLowerCase());

  const apiToken = await ensureUserIsLoggedIn();
  const extClient = new ExtensionManagerClient(apiToken);
  const platforms = await extClient.getPlatforms();
  const platformVersions = platforms.map(p => p.attributes.version);

  const version = '0.0.1';

  const questions = [{
    name: 'title',
    message: 'Title',
    default: title,
  }, {
    name: 'version',
    message: 'Version',
    default: version,
    validate: value => value.match(/^(\d+)\.(\d+)\.(\d+)+$/)
                        ? true
                        : 'Version must contain numbers in format X.Y.Z',
  }, {
    name: 'description',
    message: 'Description',
  }];

  console.log(msg.init.requestInfo());
  const answer = await inquirer.prompt(questions);

  return { name, ...answer, platform: generateNoPatchSemver(_.first(platformVersions)) };
}

export async function initExtension(extName) {
  const developer = await ensureDeveloperIsRegistered();
  const extJson = await promptExtensionInit(extName);

  utils.getExtensionCanonicalName(developer.name, extJson.name, extJson.version);

  await instantiateTemplatePath('init', cwd(), { devName: developer.name, extJson });
}
