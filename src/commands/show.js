/* eslint no-console: "off" */
import path from 'path';
import { getExtensionConfig } from '../clients/local-extensions';
import { mobileAppPackageJson } from '../clients/cli-paths';
import { readJsonFile } from '../extension/data';
import { loadMobileConfig } from '../clients/mobile-env';
import { getHostEnvName } from '../clients/server-env';
import apisConfig from '../../config/services';


import msg from '../user_messages';

function showExtension(extRootPath) {
  return getExtensionConfig(extRootPath)
    .then(config => ({
      name: config.name,
      version: config.version,
      dir: extRootPath,
    }));
}

export default async function() {
  const serverEnv = getHostEnvName();
  console.log(msg.use.show(serverEnv));
  console.log(apisConfig);

  const packageJson = await readJsonFile(await mobileAppPackageJson());
  if (packageJson == null) {
    throw new Error(msg.show.missingEnv());
  }
  console.log(msg.show.version(packageJson));

  const config = await loadMobileConfig();
  if (!config) {
    return;
  }

  if (config.appId) {
    console.log(msg.show.app(config));
  } else {
    console.log(msg.show.missingApp())
  }

  const extDirs = config.workingDirectories.map(appDir => path.join(appDir, '..'));
  const extensionsInfo = await Promise.all(extDirs.map(dir => showExtension(dir)));

  if (extensionsInfo.length === 0) {
    console.log(msg.show.missingExtensions());
  } else {
    console.log(msg.show.listExtensions(extensionsInfo));
  }
}
