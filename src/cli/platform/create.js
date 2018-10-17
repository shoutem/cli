import 'colors';
import _ from 'lodash';
import { executeAndHandleError } from '../../services/error-handler';
import { ensureUserIsLoggedIn } from '../../commands/login';
import { createPlatformArchiveProvider } from '../../services/archive';
import { uploadPlatform } from '../../commands/platform';
import { getPlatforms } from '../../clients/extension-manager';
import { getPlatformConfig } from '../../services/platform';
import confirmer from '../../services/confirmer';
import { installApplicationPlatform, installExtension } from '../../clients/app-manager';
import { spinify } from '../../services/spinner';

export const description = 'Create a new platform';
export const command = 'create';
export const builder = yargs => yargs
  .options({
    url: {
      description: 'Download location for the platform archive, if omitted the platform will be '
            + 'automatically generated from the current directory tree',
      type: 'string',
      default: '',
    },
  })
  .usage(`shoutem ${command} [options]\n\n${description}`);

const postRunInstall = platformId => `
  ${`shoutem platform install --app [app ID] --platform ${platformId}`.cyan}
  To install this platform on an app
`;

const postRunPublish = platformId => `
  ${`shoutem platform publish --platform ${platformId}`.cyan}
  To publish this platform for everyone to use
`;

export const handler = args => executeAndHandleError(() => createPlatform(args));

export async function createPlatform({ url }) {
  const developer = await ensureUserIsLoggedIn();

  const provider = await createPlatformArchiveProvider(url);
  if (provider == null) {
    throw new Error('Invalid URL parameter or not run in the valid Shoutem platform directory');
  }

  const platformResponse = await uploadPlatform(provider);

  console.log(`\nCongratulations, your new platform with ID ${platformResponse.id} is ready!`.green.bold);

  const { appId } = await getPlatformConfig();
  if (_.isNumber(appId)) {
    if (await confirmer(`Do you want to install the new platform into app ${appId}?`)) {
      await spinify(installApplicationPlatform(appId, platformResponse.id));
    }
  } else {
    console.log(postRunInstall(platformResponse.id));
  }

  console.log(postRunPublish(platformResponse.id));
  console.log('Success!'.green.bold);
  console.log('Happy coding!');
}
