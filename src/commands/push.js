/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import mzfs from 'mz/fs';

import { ExtensionManagerClient } from '../clients/extension-manager';
import { ensureDeveloperIsRegistered } from './register';
import * as utils from '../extension/data';

import shoutemPack from '../extension/packer';

import msg from '../user_messages';


async function setPackageNameVersion(path, name, version) {
  const data = await utils.readJsonFile(path);
  if (data == null) {
    return;
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

export function uploadExtension(opts = {}) {
  const getDev = ensureDeveloperIsRegistered();
  const getExtJson = getDev.then(() => utils.loadExtensionJsonAsync());

  const pack = Promise.all([getDev, getExtJson])
    .then(([dev, extJson]) => setExtNameVersionInPackageJson(`${dev.name}.${extJson.name}`, extJson.version))
    .then(() => shoutemPack(process.cwd(), { packToTempDir: true, nobuild: opts.nobuild }));

  const upload = Promise.all([getDev, getExtJson, pack])
    .then(([dev, extJson, packResult]) => {
      const stream = fs.createReadStream(packResult.package);
      const id = utils.getExtensionCanonicalName(dev.name, extJson.name, extJson.version);
      const extensionManager = new ExtensionManagerClient(dev.apiToken);

      console.log(msg.push.uploadingInfo(extJson));
      return extensionManager.uploadExtension(id, stream);
    });

  const deletePkg = Promise.all([pack, upload])
    .then(([fname, ]) => mzfs.unlink(fname.package));

  return Promise.all([upload, deletePkg, pack, getExtJson])
    .then(([extensionId, , packResult, extJson]) => ({ extensionId, packResult, extJson }));
}
