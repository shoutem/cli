import path from 'path';
import {getPlatformConfig, getPlatformRootDir} from "../../extension/platform";
import {executeAndHandleError} from "../../extension/error-handler";
import {initExtension} from "../../commands/init";
import {publishExtension, pushAndPublish} from "../../commands/publish";
import {uploadExtension} from "../../commands/push";
import {installLocalExtension} from "../../commands/install";

export const description = 'Create a new extension for the current app';
export const command = 'add <name>';
export const builder = yargs => {
    return yargs
        .usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ name }) => executeAndHandleError(async () => {
  const platformDir = await getPlatformRootDir();
  const extensionPath = await initExtension(name, path.join(platformDir, 'extensions'));
  await uploadExtension({}, extensionPath);
  await publishExtension(extensionPath);
  const { appId } = await getPlatformConfig(platformDir);
  await installLocalExtension(appId, extensionPath);
});

