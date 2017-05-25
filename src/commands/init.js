import _ from 'lodash';
import inquirer from 'inquirer';
import { instantiateTemplatePath } from '../extension/template';
import { ensureUserIsLoggedIn } from '../commands/login';
import msg from '../user_messages';
import { getPlatforms } from '../clients/extension-manager';
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

  const platformVersions = (await getPlatforms()).map(({ version }) => version);

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
  const developer = await ensureUserIsLoggedIn();
  const extJson = await promptExtensionInit(extName);

  utils.getExtensionCanonicalName(developer.name, extJson.name, extJson.version);

  const packageJson = {
    name: `${developer.name}.${extJson.name}`,
    version: extJson.version,
    description: extJson.description
  };

  await instantiateTemplatePath('init', cwd(), {
    devName: developer.name,
    extJson,
    extJsonString: JSON.stringify(extJson, null, 2),
    packageJsonString: JSON.stringify(packageJson, null, 2)
  });
}
