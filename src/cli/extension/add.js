import path from 'path';
import {
  addToExtensionsJs, configurePlatform, getPlatformConfig, getPlatformRootDir,
  linkLocalExtension
} from "../../extension/platform";
import {executeAndHandleError} from "../../extension/error-handler";
import {initExtension} from "../../commands/init";
import {publishExtension} from "../../commands/publish";
import {uploadExtension} from "../../commands/push";
import {installLocalExtension} from "../../commands/install";
import 'colors';

export const description = 'Create a new extension for the current app';
export const command = 'add <name>';
export const builder = yargs => {
    return yargs
      .options({
        local: {
          description: 'Extension is only added locally and is not published or installed on the shoutem server',
          type: 'boolean',
          default: false
        }
      })
      .usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ name, local }) => executeAndHandleError(async () => {
  const platformDir = await getPlatformRootDir();
  const extensionPath = await initExtension(name, path.join(platformDir, 'extensions'));

  if (!local) {
    await uploadExtension({}, extensionPath);
    await publishExtension(extensionPath);

    const { appId } = await getPlatformConfig(platformDir);
    console.log('Installing it in your app...');
    await installLocalExtension(appId, extensionPath);
  }

  await linkLocalExtension(platformDir, extensionPath);
  await addToExtensionsJs(platformDir, extensionPath);

  console.log('\nSuccess!'.green.bold);
});
