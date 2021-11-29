import bluebird from 'bluebird';
import { pathExists } from 'fs-extra';
import { prompt, Separator } from 'inquirer';
import path from 'path';
import { canPublish } from '../clients/extension-manager';
import { getHostEnvName } from '../clients/server-env';
import { handleError } from '../services/error-handler';
import { getExtensionCanonicalName, loadExtensionJson } from '../services/extension';
import { spinify, startSpinner } from '../services/spinner';
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { ensureUserIsLoggedIn } from './login';

export async function pushAll(args) {
  const dev = await ensureUserIsLoggedIn();
  const extPaths = await bluebird.filter(args.paths, f => 
    pathExists(path.join(f, 'extension.json'))
  );

  if (extPaths.length === 0) {
    console.log('No extensions found in current directory.');
    return [];
  }

  if (args.nopush) {
    return { pushed: extPaths, notPushed: [] };
  }

  let { pathsToPush } =
    args.noconfirm ||
    (await prompt({
      type: 'checkbox',
      name: 'pathsToPush',
      message: `Check which extensions you want to push to ${getHostEnvName()}.`,
      choices: extPaths.concat(new Separator()),
      default: extPaths,
      pageSize: 20,
    }));
  pathsToPush = pathsToPush || extPaths;

  const pushed = [];
  const notPushed = [];

  for (const extPath of pathsToPush) {
    const extJson = await loadExtensionJson(extPath);
    const { name, version } = extJson;

    const canonical = getExtensionCanonicalName(dev.name, name, version);
    const canExtensionBePublished = await spinify(
      canPublish(canonical), 
      `Checking if version ${version} can be published...`,
    );

    if (canExtensionBePublished) {
      try {
        await uploadExtension(args, extPath);
        console.log(msg.push.complete());
        pushed.push(extPath);
      } catch (err) {
        await handleError(err);
        notPushed.push(extPath);
      }
    } else {
      console.log(msg.publish.alreadyPublished(extJson));
      notPushed.push(extPath);
    }
  }

  if (pushed.length > 0) {
    console.log(`Uploaded:`);
    console.log(pushed.map(e => `  ${e}`).join('\n'));
  }

  if (notPushed.length > 0) {
    console.log(`Not uploaded:`);
    console.log(notPushed.map(e => `  ${e}`).join('\n'));
  }

  return { pushed, notPushed };
}
