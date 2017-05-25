import fs from 'fs';
import path from 'path';
import mzfs from 'mz/fs';
import * as extensionManager from '../clients/extension-manager';
import { getHostEnvName } from '../clients/server-env';
import { ensureInExtensionDir } from '../extension/data';
import { ensureUserIsLoggedIn } from './login';
import * as utils from '../extension/data';
import shoutemPack from '../extension/packer';
import msg from '../user_messages';
import _ from 'lodash';
import { createProgressHandler } from '../extension/progress-bar';
import { startSpinner } from '../extension/spinner';

async function setPackageNameVersion(path, name, version) {
  const data = await utils.readJsonFile(path);
  if (data === null) {
    return null;
  }

  data.name = name;
  data.version = version;

  await utils.writeJsonFile(data, path);
  return data;
}

function setExtNameVersionInPackageJson(extName, version, root = utils.getExtensionRootDir()) {
  const appPath = path.join(root, 'app', 'package.json');
  const serverPath = path.join(root, 'server', 'package.json');

  return Promise.all([
    setPackageNameVersion(serverPath, extName, version),
    setPackageNameVersion(appPath, extName, version)
  ]);
}

export async function uploadExtension(opts = {}, extensionDir = ensureInExtensionDir()) {
  const dev = await ensureUserIsLoggedIn();

  const extJson = await utils.loadExtensionJsonAsync(extensionDir);
  await setExtNameVersionInPackageJson(`${dev.name}.${extJson.name}`, extJson.version, extensionDir);
  const packResult = await shoutemPack(extensionDir, { packToTempDir: true, nobuild: opts.nobuild });

  const { size } = await mzfs.stat(packResult.package);
  const stream = fs.createReadStream(packResult.package);

  const id = utils.getExtensionCanonicalName(dev.name, extJson.name, extJson.version);

  console.log(msg.push.uploadingInfo(extJson, getHostEnvName()));
  let spinner = null;
  const extensionId = await extensionManager.uploadExtension(
    id,
    stream,
    createProgressHandler('Upload progress', size, () => spinner = startSpinner('Processing upload... %s')),
    size
  );

  if (spinner) {
    spinner.stop(true);
  }

  await mzfs.unlink(packResult.package);

  const notPacked = _.difference(packResult.allDirs, packResult.packedDirs);
  if (notPacked.length > 0) {
    throw new Error(msg.push.missingPackageJson(notPacked));
  }

  return { extensionId, packResult, extJson };
}
