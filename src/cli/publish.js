import msg from '../user_messages';
import { publishExtension, pushAndPublish } from '../commands/publish';
import pushAll from '../commands/push-all';
import { handleError } from '../services/error-handler';
import multiglob from '../services/multiglob';
import confirmPublish from '../commands/confirm-admin-action';

export const description = 'Publishes current extension version.';
export const command = 'publish [paths..]';
export const builder = (yargs) => {
  yargs
    .options({
      nobuild: {
        type: 'boolean',
        description: 'Pushes and publishes the extension without building it. Use this option carefully!',
      },
      nopush: {
        type: 'boolean',
        description: 'Publishes the extension without pushing it first. Use this option carefully!',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  if (!await confirmPublish('WARNING: You are about to publish using the \'shoutem\' developer account. Are you sure about that?')) {
    console.log('Publish aborted'.bold.yellow);
    return;
  }

  try {
    if (args.paths.length === 0) {
      await pushAndPublish(args);
      console.log('Success'.green.bold);
    } else {
      const resolvedArgs = { ...args, paths: multiglob(args.paths) };
      const { pushed, notPushed } = await pushAll(resolvedArgs);

      const published = [];
      let notPublished = [];
      // no-await-in-loop array itterration is not possible due to await
      /* eslint-disable */
      for (const extPath of pushed) {
        try {
          const result = await publishExtension(extPath);
          console.log(msg.publish.complete(result).green.bold);
          published.push(extPath);
        } catch (err) {
          await handleError(err);
          notPublished.push(extPath);
        }
      }
      /* eslint-disable */

      console.log();
      if (published.length > 0) {
        console.log('Published:');
        console.log(published.map(e => `  ${e}`).join('\n'));
      }

      notPublished = [...notPublished, ...notPushed];
      if (notPublished.length > 0) {
        console.log('Not published:');
        console.log(notPublished.map(e => `  ${e}`).join('\n'));
      }
    }
  } catch (err) {
    await handleError(err);
  }
}
