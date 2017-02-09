/* eslint no-console: 0 */
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { pathExists } from '../extension/data';
import fs from 'mz/fs';
import bluebird from 'bluebird';
import path from 'path';
import { prompt } from 'inquirer';
import { getHostEnvName } from '../clients/server-env';

export async function pushAll(args) {
  const dirFiles = await fs.readdir(process.cwd());
  const extPaths = await bluebird.filter(dirFiles, f => pathExists(path.join(f, 'extension.json')));
  console.log('About to push following extensions:');
  console.log(extPaths.map(e => `  ${e}`).join('\n'));

  const pushed = [];
  const notPushed = [];

  if (extPaths.length === 0) {
    console.log('No extensions found in current directory.');
  }

  for (const extPath of extPaths) {
    const { shouldPush } = args.noconfirm || await prompt({
      type: 'confirm',
      name: 'shouldPush',
      message: `Push ${extPath} to ${getHostEnvName()}?`,
      default: false
    });
    if (args.noconfirm || shouldPush) {
      await uploadExtension(args, extPath);
      pushed.push(extPath);
      console.log(msg.push.complete());
    } else {
      notPushed.push(extPath);
    }
  }

  if (pushed.length > 0) {
    console.log(`Pushed:`);
    console.log(pushed.map(e => `  ${e}`).join('\n'));
  }
  if (notPushed.length > 0) {
    console.log(`Not pushed:`);
    console.log(notPushed.map(e => `  ${e}`).join('\n'));
  }

  return pushed;
}
