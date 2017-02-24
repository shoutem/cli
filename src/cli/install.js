/* eslint no-console: 0 */
import services from '../../config/services';
import {
  createNewApp,
  ensureApp,
  installExtensionById,
  installLocalExtension,
} from '../commands/install';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';

export const description = 'Install the current extension to an application.';

export const command = 'install';
export const builder = yargs => {
  return yargs
    .options({
      app: {
        alias: 'a',
          description: 'app id to install current extension to',
          requiresArg: true
      },
      new: {
      alias: 'n',
        description: 'install to a new app with given name',
        type: 'string'
      }})
    .usage(`usage: shoutem ${command} [options]\n\n${description}`);
};

export function handler(program) {
  function installToApp(appId, newApp = false) {
    function handleInstall(err) {
      if (err) handleError(err);
      else {
        console.log(newApp
          ? msg.install.completeOntoNew(program.new)
          : msg.install.complete());
        const url = `${services.appBuilder}/app/${appId}`;
        console.log(msg.install.seeNewInBrowser(url));
      }
    }

    if (program.extension) {
      installExtensionById(program.extension, appId, handleInstall);
    } else {
      installLocalExtension(appId, handleInstall);
    }
  }
  if (program.new === '') {
    program.new = 'My Blank App';
  }

  if (program.new) {
    createNewApp(program.new, (err, app) => {
      if (err) handleError(err);
      else installToApp(app.id, true);
    });
  } else if (program.app) installToApp(program.app);
  else ensureApp((appErr, app) => installToApp(app.id));
}
