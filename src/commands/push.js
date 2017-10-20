import fs from 'fs-extra';
import * as extensionManager from '../clients/extension-manager';
import {getHostEnvName} from '../clients/server-env';
import * as local from '../clients/local-extensions';
import {
  ensureInExtensionDir,
  getExtensionCanonicalName,
  loadExtensionJson,
  saveExtensionJson
} from '../services/extension';
import shoutemPack from '../services/packer';
import msg from '../user_messages';
import _ from 'lodash';
import {createProgressHandler} from '../services/progress-bar';
import {spinify, startSpinner} from '../services/spinner';
import extLint from '../services/extlint';
import {ensureUserIsLoggedIn} from "./login";
import {canPublish} from "../clients/extension-manager";
import { prompt } from 'inquirer';
import semver from 'semver';

export async function uploadExtension(opts = {}, extensionDir = ensureInExtensionDir()) {
  if (!opts.nocheck) {
    process.stdout.write('Checking the extension code for syntax errors... ');
    try {
      await extLint(extensionDir);
      console.log(`[${'OK'.green.bold}]`);
    } catch (err) {
      err.message = 'Syntax errors detected, aborting push! Use `shoutem push --nocheck` to override';
      throw err;
    }
  }
  const extJson = await loadExtensionJson(extensionDir);
  if (opts.publish) {
    await promptPublishableVersion(extJson);
    await saveExtensionJson(extJson, extensionDir);
  }

  const packResult = await shoutemPack(extensionDir, { packToTempDir: true, nobuild: opts.nobuild });

  const { size } = await fs.stat(packResult.package);
  const stream = fs.createReadStream(packResult.package);

  const id = await local.getExtensionCanonicalName(extensionDir);

  let spinner = null;
  const extensionId = await extensionManager.uploadExtension(
    id,
    stream,
    createProgressHandler({ msg: 'Upload progress', total: size, onFinished: () => spinner = startSpinner('Processing upload...') }),
    size
  );
  if (spinner) {
    spinner.stop(true);
    console.log(`Processing upload... [${'OK'.green.bold}]`);
  }
  console.log(msg.push.uploadingInfo(extJson, getHostEnvName()) + ` [${'OK'.green.bold}]`);

  await fs.unlink(packResult.package);

  const notPacked = _.difference(packResult.allDirs, packResult.packedDirs);
  if (notPacked.length > 0) {
    throw new Error(msg.push.missingPackageJson(notPacked));
  }

  return { extensionId, packResult, extJson };
}

export async function promptPublishableVersion(extJson) {
  const dev = await ensureUserIsLoggedIn();
  while (true) {
    const { name, version } = extJson;
    const canonical = getExtensionCanonicalName(dev.name, name, version);
    const canExtensionBePublished = await spinify(canPublish(canonical), `Checking if version ${version} can be published`);
    if (canExtensionBePublished) {
      return;
    }
    const { newVersion } = await prompt({
      name: 'newVersion',
      default: semver.inc(version, 'patch'),
      message: `Version ${version} is already published. Specify another version:`,
      validate: v => !!semver.valid(v),
    });
    extJson.version = newVersion;
  }
}
