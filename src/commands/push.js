/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import mzfs from 'mz/fs';

import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureInExtensionDir } from '../extension/data';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';

import shoutemPack from '../extension/packer';

import msg from '../user_messages';


async function setPackageNameVersion(path, name, version) {
  const data = await utils.readJsonFile(path);
  if (data == null) {
    return null;
  }

  data.name = name;
  data.version = version;

  await utils.writeJsonFile(data, path);
  return data;
}

function setExtNameVersionInPackageJson(extName, version) {
  const root = utils.getExtensionRootDir();
  const appPath = path.join(root, 'app', 'package.json');
  const serverPath = path.join(root, 'server', 'package.json');

  return Promise.all([
    setPackageNameVersion(serverPath, extName, version),
    setPackageNameVersion(appPath, extName, version)
  ]);
}

export async function uploadExtension(opts = {}) {
  const extensionDir = ensureInExtensionDir();
  const dev = await ensureDeveloperIsRegistered();

  const extJson = await utils.loadExtensionJsonAsync();
  await setExtNameVersionInPackageJson(`${dev.name}.${extJson.name}`, extJson.version);
  const packResult = await shoutemPack(extensionDir, { packToTempDir: true, nobuild: opts.nobuild });

  const stream = fs.createReadStream(packResult.package);
  const id = utils.getExtensionCanonicalName(dev.name, extJson.name, extJson.version);
  const extensionManager = new ExtensionManagerClient(dev.apiToken);

  console.log(msg.push.uploadingInfo(extJson));
  const extensionId = await extensionManager.uploadExtension(id, stream);
  await mzfs.unlink(packResult.package);

  return { extensionId, packResult, extJson };
}
