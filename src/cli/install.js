import { createNewApp, ensureApp, installLocalExtension } from '../commands/install';
import services from '../../config/services';
import { ensureUserIsLoggedIn } from '../commands/login';
import { handleError } from '../services/error-handler';
import msg from '../user_messages';

export const description = 'Install the current extension to an app on the Shoutem Builder.';

export const command = 'install';
export const builder = (yargs) => {
  yargs
    .options({
      app: {
        alias: 'a',
        description: 'Specifies app id to install current extension to.',
        requiresArg: true,
      },
      new: {
        alias: 'n',
        description: 'Creates new app with the given name and installs the extension to it.',
        type: 'string',
      },
    })
    .usage(`usage: shoutem ${command} [options]\n\n${description}`);
};

export async function handler(options) {
  try {
    await ensureUserIsLoggedIn();
    const appCreationRequested = options.new || options.new === '';

    let appId;
    if (appCreationRequested) {
      if (options.app) {
        throw new Error('`app` and `new` flags can\'t be used together');
      }
      appId = (await createNewApp(options.new || 'My Blank App')).id;
    } else if (options.app) {
      appId = options.app;
    } else {
      appId = (await ensureApp()).id;
    }

    await installLocalExtension(appId);

    console.log(msg.install.complete());
    const url = `${services.appBuilder}/app/${appId}`;
    console.log(msg.install.seeNewInBrowser(url));
  } catch (err) {
    await handleError(err);
  }
}
