import fs from 'fs-extra';
import path from 'path';
import * as extensionManager from '../clients/extension-manager';
import {getHostEnvName} from '../clients/server-env';
import {getExtensionCanonicalName} from '../clients/local-extensions';
import * as utils from '../services/extension';
import {ensureUserIsLoggedIn} from './login';
import shoutemPack from '../services/packer';
import msg from '../user_messages';
import _ from 'lodash';
import {createProgressHandler} from '../services/progress-bar';
import {startSpinner} from '../services/spinner';
import extLint from '../services/extlint';
import {readJsonFile, writeJsonFile} from "../services/data";

async function setPackageNameVersion(path, name, version) {
  const data = await readJsonFile(path);
  if (data === null) {
    return null;
  }

  data.name = name;
  data.version = version;

  await writeJsonFile(data, path);
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

export async function uploadExtension(opts = {}, extensionDir = utils.ensureInExtensionDir()) {
  if (!opts.nocheck) {
    console.log('Checking the extension code for syntax errors...');
    try {
      await extLint(extensionDir);
    } catch (err) {
      err.message = 'Syntax errors detected, aborting push! Use `shoutem push --nocheck` to override';
      throw err;
    }
  }
  const dev = await ensureUserIsLoggedIn();
  const extJson = await utils.loadExtensionJson(extensionDir);
  await setExtNameVersionInPackageJson(`${dev.name}.${extJson.name}`, extJson.version, extensionDir);
  const packResult = await shoutemPack(extensionDir, { packToTempDir: true, nobuild: opts.nobuild });

  const { size } = await fs.stat(packResult.package);
  const stream = fs.createReadStream(packResult.package);

  const id = await getExtensionCanonicalName(extensionDir);

  console.log(msg.push.uploadingInfo(extJson, getHostEnvName()));
  let spinner = null;
  const extensionId = await extensionManager.uploadExtension(
    id,
    stream,
    createProgressHandler({ msg: 'Upload progress', total: size, onFinished: () => spinner = startSpinner('Processing upload... %s') }),
    size
  );

  if (spinner) {
    spinner.stop(true);
  }

  await fs.unlink(packResult.package);

  const notPacked = _.difference(packResult.allDirs, packResult.packedDirs);
  if (notPacked.length > 0) {
    throw new Error(msg.push.missingPackageJson(notPacked));
  }

  return { extensionId, packResult, extJson };
}
