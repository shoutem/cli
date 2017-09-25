import fs from 'fs-extra';
import * as extensionManager from '../clients/extension-manager';
import {getHostEnvName} from '../clients/server-env';
import {getExtensionCanonicalName} from '../clients/local-extensions';
import { ensureInExtensionDir, loadExtensionJson } from '../services/extension';
import shoutemPack from '../services/packer';
import msg from '../user_messages';
import _ from 'lodash';
import {createProgressHandler} from '../services/progress-bar';
import {startSpinner} from '../services/spinner';
import extLint from '../services/extlint';

export async function uploadExtension(opts = {}, extensionDir = ensureInExtensionDir()) {
  if (!opts.nocheck) {
    console.log('Checking the extension code for syntax errors...');
    try {
      await extLint(extensionDir);
    } catch (err) {
      err.message = 'Syntax errors detected, aborting push! Use `shoutem push --nocheck` to override';
      throw err;
    }
  }
  const extJson = await loadExtensionJson(extensionDir);
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
