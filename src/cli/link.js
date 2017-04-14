/* eslint no-console: "off" */
import { getExtensionRootDir } from '../extension/data';
import { linkExtension, linkDirectory } from '../extension/linker';
import msg from '../user_messages';

export const description = 'Link working directory extension with mobile environment';
export const command = 'link';
export const builder = yargs => {
  return yargs
    .options({
      force: {
      alias: 'f',
        type: 'boolean',
        description: 'Link current directory even if it\'s not an extension directory'
      }})
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  const extensionDir = getExtensionRootDir();

  if (!extensionDir && !args.force) {
    console.log('Not an extension directory. Use `shoutem link --force` to link an arbitrary directory.');
    return null;
  }

  if (args.force) {
    await linkDirectory(extensionDir || process.cwd());
  } else if (extensionDir) {
    await linkExtension(extensionDir);
  } else {
    console.log('Not an extension directory. Use `shoutem link --force` to link an arbitrary directory.')
  }
  console.log(msg.link.complete());
}
