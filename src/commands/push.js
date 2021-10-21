import fs from 'fs-extra';
import path from 'path';
import { prompt } from 'inquirer';
import semver from 'semver';
import _ from 'lodash';
import * as extensionManager from '../clients/extension-manager';
import * as local from '../clients/local-extensions';
import { getHostEnvName } from '../clients/server-env';
import {
  ensureInExtensionDir,
  getExtensionCanonicalName,
  loadExtensionJson,
  saveExtensionJson,
} from '../services/extension';
import extLint from '../services/extlint';
import shoutemPack from '../services/packer';
import { createProgressHandler } from '../services/progress-bar';
import { spinify, startSpinner } from '../services/spinner';
import msg from '../user_messages';
import { ensureUserIsLoggedIn } from './login';

function ensureRequiredFilesExist(dir, extTitle) {
  const requiredFiles = [
    'app/package.json',
    'app/index.js',
    'server/package.json',
  ];

  process.stdout.write('Checking for required files...');
  const missingFiles = [];

  _.forEach(requiredFiles, fileName => {
    if (!fs.existsSync(path.join(dir, fileName))) {
      missingFiles.push(fileName);
    }
  });

  if (missingFiles.length) {
    console.log('\n');
    throw new Error(msg.push.missingRequiredFile(missingFiles, extTitle));
  }
  console.log(`[${'OK'.green.bold}]`);
}

export async function promptPublishableVersion(extJson) {
  const dev = await ensureUserIsLoggedIn();

  while (true) {
    const { name, version } = extJson;
    const canonical = getExtensionCanonicalName(dev.name, name, version);
    const canExtensionBePublished = await spinify(
      extensionManager.canPublish(canonical),
      `Checking if version ${version} can be published...`,
    );

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

export async function uploadExtension(
  opts = {},
  extensionDir = ensureInExtensionDir(),
) {
  const extJson = await loadExtensionJson(extensionDir);
  console.log(`Uploading ${extJson.title.cyan}:`);

  try {
    ensureRequiredFilesExist(extensionDir, extJson.title);
  } catch (err) {
    throw err;
  }

  if (!opts.nocheck) {
    try {
      process.stdout.write('Checking the extension code for syntax errors...');
      await extLint(extensionDir);
    } catch (err) {
      if (err.message) {
        throw err;
      } else {
        err.message =
          'Syntax errors detected, aborting push! Use `shoutem push --nocheck` to override, but use with caution!';
        throw err;
      }
    }

    console.log(`[${'OK'.green.bold}]`);
  }

  if (opts.publish) {
    await promptPublishableVersion(extJson);
    await saveExtensionJson(extJson, extensionDir);
  }

  const packResult = await shoutemPack(extensionDir, {
    packToTempDir: true,
    nobuild: opts.nobuild,
  });

  const { size } = await fs.stat(packResult.package);
  const stream = fs.createReadStream(packResult.package);

  const id = await local.getExtensionCanonicalName(extensionDir);

  let spinner = null;
  const extensionId = await extensionManager.uploadExtension(
    id,
    stream,
    createProgressHandler({
      msg: 'Upload progress',
      total: size,
      onFinished: () => (spinner = startSpinner('Processing upload...')),
    }),
    size,
  );

  if (spinner) {
    spinner.stop(true);
    console.log(`Processing upload... [${'OK'.green.bold}]`);
  }
  console.log(
    `${msg.push.uploadingInfo(extJson, getHostEnvName())} [${'OK'.green.bold}]`,
  );

  await fs.unlink(packResult.package);

  const notPacked = _.difference(packResult.allDirs, packResult.packedDirs);

  if (notPacked.length > 0) {
    throw new Error(msg.push.missingPackageJson(notPacked));
  }

  return { extensionId, packResult, extJson };
}
