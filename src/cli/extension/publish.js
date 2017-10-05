import path from 'path';
import {executeAndHandleError} from "../../services/error-handler";
import {ensureUserIsLoggedIn} from "../../commands/login";
import {getPlatformExtensionsDir} from "../../services/platform";
import { pathExists } from 'fs-extra';
import {uploadExtension} from "../../commands/push";
import {publishExtension} from "../../commands/publish";

export const description = 'Publish an extension from the app in the working directory';
export const command = 'publish <name>';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ name }) => executeAndHandleError(async () => {
  const dev = await ensureUserIsLoggedIn();
  const extensionPath = path.join(await getPlatformExtensionsDir(), `${dev.name}.${name}`);

  if (!await pathExists(extensionPath)) {
    throw new Error(`Path ${path.relative(process.cwd(), extensionPath)} does not exist`);
  }

  await uploadExtension({ publish: true }, extensionPath);
  await publishExtension(extensionPath);
});
