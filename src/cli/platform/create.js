import 'colors';
import _ from 'lodash';
import { installPlatform } from './install';
import { publishOwnPlatform } from './publish';
import confirmer from '../../services/confirmer';
import { spinify } from '../../services/spinner';
import { ensureUserIsLoggedIn } from '../../commands/login';
import { getPlatformConfig } from '../../services/platform';
import { executeAndHandleError } from '../../services/error-handler';
import { uploadPlatformArchive } from '../../commands/platform';
import { createPlatformArchiveProvider } from '../../services/platform-archive';
import { platformMessages } from '../const';

export const description = 'Create a new platform';
export const command = 'create';
export const builder = yargs => yargs
  .options({
    url: {
      description: platformMessages.platformUrlDescription,
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
    throw new Error(platformMessages.platformLocationInvalidMessage);
  }

  const platformResponse = await uploadPlatformArchive(provider);

  console.log(`\nCongratulations, your new platform with ID ${platformResponse.id} is ready!`.green.bold);

  let published = false;
  let installed = false;
  if (await confirmer('Do you want to publish the new platform?')) {
    await spinify(publishOwnPlatform({ platform: platformResponse.id }));
    published = true;
  }

  const { appId } = await getPlatformConfig();
  if (!_.isNil(appId)) {
    if (await confirmer(`Do you want to install the new platform to this app (${appId})?`)) {
      await spinify(installPlatform({ app: appId, platform: platformResponse.id }));
      installed = true;
    }

    console.log(`\nYou can manage your platforms for this app any time at https://builder.shoutem.com/app/${appId}/settings/platform`);
  }

  if (!published || !installed) {
    console.log('You might want to try: ');

    if (!published) {
      console.log(postRunPublish(platformResponse.id));
    }

    if (!installed) {
      console.log(postRunInstall(platformResponse.id));
    }
  }
}
