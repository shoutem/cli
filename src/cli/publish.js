import msg from '../user_messages';
import { publishExtension, pushAndPublish } from '../commands/publish';
import { pushAll } from '../commands/push-all';
import { handleError } from '../extension/error-handler';
import multiglob from '../extension/multiglob';
import confirmPublish from '../commands/confirm-admin-action';

export const description = 'Publish current extension version.';
export const command = 'publish [paths..]';
export const builder = yargs => {
  return yargs
    .options({
      nobuild: {
        type: 'boolean',
        description: 'Push and publish the extension without building it. Use this option carefully!'
      },
      nopush: {
        type: 'boolean',
        description: 'Publish the extension without pushing it first. Use this option carefully!'
      }
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};
export async function handler(args) {
  if (!await confirmPublish('WARNING: you are about to publish using shoutem developer. Are you sure about that?')) {
    console.log('Publish aborted'.bold.yellow);
    return null;
  }

  try {
    if (args.paths.length === 0) {
      const result = await pushAndPublish(args);
      console.log(msg.publish.complete(result));
    } else {
      args.paths = multiglob(args.paths);
      const { pushed, notPushed } = await pushAll(args);

      const published = [];
      let notPublished = [];
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

      console.log();
      if (published.length > 0) {
        console.log(`Published:`);
        console.log(published.map(e => `  ${e}`).join('\n'));
      }

      notPublished = [...notPublished, ...notPushed];
      if (notPublished.length > 0) {
        console.log(`Not published:`);
        console.log(notPublished.map(e => `  ${e}`).join('\n'));
      }
    }
  } catch (err) {
    await handleError(err);
  }
}
