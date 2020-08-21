import bluebird from 'bluebird';
import { pathExists } from 'fs-extra';
import { prompt, Separator } from 'inquirer';
import path from 'path';

import { getHostEnvName } from '../clients/server-env';
import { handleError } from '../services/error-handler';
import msg from '../user_messages';
import { uploadExtension } from './push';

export default async function pushAll(args) {
  const extPaths = await bluebird.filter(args.paths, f => pathExists(path.join(f, 'extension.json')));

  if (extPaths.length === 0) {
    console.log('No extensions found in current directory.');
    return [];
  }

  if (args.nopush) {
    return { pushed: extPaths, notPushed: [] };
  }

  let { pathsToPush } = args.noconfirm || await prompt({
    type: 'checkbox',
    name: 'pathsToPush',
    message: `Check which extensions you want to push to ${getHostEnvName()}.`,
    choices: extPaths.concat(new Separator()),
    default: extPaths,
    pageSize: 20,
  });
  pathsToPush = pathsToPush || extPaths;

  const pushed = [];
  const notPushed = [];

  // no-await-in-loop vs. unusable await inside array itteraton
  /* eslint-disable */
  for (const extPath of pathsToPush) {
    try  {
      await uploadExtension(args, extPath);
      console.log(msg.push.complete());
      pushed.push(extPath);
    } catch (err) {
      await handleError(err);
      notPushed.push(extPath);
    }
  }
  /* eslint-enable */

  if (pushed.length > 0) {
    console.log('Pushed:');
    console.log(pushed.map(e => `  ${e}`).join('\n'));
  }

  if (notPushed.length > 0) {
    console.log('Not pushed:');
    console.log(notPushed.map(e => `  ${e}`).join('\n'));
  }

  return { pushed, notPushed };
}
