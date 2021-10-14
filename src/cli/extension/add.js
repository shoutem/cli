import path from 'path';
import {
  addToExtensionsJs,
  getPlatformConfig,
  getPlatformExtensionsDir,
  getPlatformRootDir,
  linkLocalExtension,
} from '../../services/platform';
import { executeAndHandleError } from '../../services/error-handler';
import { initExtension } from '../../commands/init';
import { uploadExtension } from '../../commands/push';
import { installLocalExtension } from '../../commands/install';
import 'colors';
import { spinify } from '../../services/spinner';
import { publishExtension } from '../../commands/publish';

export const description = 'Create a new extension for the current app';
export const command = 'add <name>';
export const builder = yargs => {
  return yargs
    .options({
      local: {
        description:
          'Extension is only added locally and is not published or installed on the Shoutem Builder',
        type: 'boolean',
        default: false,
      },
    })
    .usage(`shoutem ${command}\n\n${description}`);
};

const postRunMessage = `
  ${'shoutem screen add'.cyan}
    add a new screen

  ${'shoutem schema add <schemaName>'.cyan}
    add a new data schema

  ${'shoutem theme add <themeName>'.cyan}
    add a new theme

  ${'shoutem page add'.cyan}
    add a new settings page
`;

export async function addExtension({ name, local, externalDestination }) {
  const platformDir = externalDestination || (await getPlatformRootDir());
  const extensionPath = await initExtension(
    name,
    externalDestination || (await getPlatformExtensionsDir(platformDir)),
  );

  if (!local && !externalDestination) {
    await uploadExtension({ publish: true }, extensionPath);
    await publishExtension(extensionPath);

    const { appId } = await getPlatformConfig(platformDir);
    await spinify(
      installLocalExtension(appId, extensionPath),
      'Installing it in your app...',
      'OK',
    );
  }

  if (!externalDestination) {
    console.log('\nRunning install script:');
    await linkLocalExtension(platformDir, extensionPath);
    await addToExtensionsJs(platformDir, extensionPath);
    console.log(`extension installation [${'OK'.bold.green}]`);
  }

  const cdCommand = `cd ${path.relative(process.cwd(), extensionPath)}`;
  console.log('\nCongratulations, your new extension is ready!'.green.bold);
  console.log(`You can now do '${cdCommand.cyan}' where you can:`);
  console.log(postRunMessage);
  console.log('Happy coding!\n');
}

export const handler = args => executeAndHandleError(() => addExtension(args));
