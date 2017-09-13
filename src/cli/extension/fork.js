import { copy, pathExists } from 'fs-extra';
import path from 'path';
import {executeAndHandleError} from "../../services/error-handler";
import {configurePlatform, getPlatformConfig, getPlatformRootDir} from "../../services/platform";
import {loadExtensionJson} from "../../services/data";
import {getDeveloper} from "../../clients/extension-manager";
import {installLocalExtension} from "../../commands/install";
import {uploadExtension} from "../../commands/push";
import {publishExtension} from "../../commands/publish";
import {promptExtensionInit} from "../../commands/init";

export const description = 'Fork existing extension under your developer name';
export const command = 'fork <canonicalName>';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command}\n\n${description}`);
};

export const handler = ({ canonicalName }) => executeAndHandleError(async () => {
  const platformPath = await getPlatformRootDir();
  const srcPath = path.join(platformPath, 'extensions', canonicalName);

  if (!await pathExists(srcPath)) {
    throw new Error(`Extension ${srcPath} does not exist`);
  }

  const extName = (await loadExtensionJson(srcPath)).name;
  const devName = (await getDeveloper()).name;

  const destCanonicalName = `${devName}.${extName}`;
  const destPath = path.join(platformPath, 'extensions', destCanonicalName);

  if (await pathExists(destPath)) {
    throw new Error(`Extension ${destPath} already exists`);
  }

  await copy(srcPath, destPath);

  await uploadExtension({}, destPath);
  await publishExtension(destPath);

  const { appId } = await getPlatformConfig(platformPath);
  console.log('Installing it in your app...');
  await installLocalExtension(appId, destPath);

  await configurePlatform(platformPath);
  console.log('\nSuccess!'.green.bold);
  console.log('You can run `shoutem builder` to open the app in shoutem builder using default browser');
});
