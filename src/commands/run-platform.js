import path from 'path';
import url from 'url';
import cliUrls from '../../config/services';
import * as npm from '../extension/npm';
import { ensureDeveloperIsRegistered } from '../commands/register';
import * as paths from '../clients/cli-paths';
import { readJsonFile, writeJsonFile } from '../extension/data';
import * as platformBuild from '../extension/platform-build';
import { buildPlatform } from '../extension/platform';
import selectApp from '../extension/app-selector';

export default async function(platform, opts) {
  if (!opts.noclean) {
    await platformBuild.clean();
  }

  await platformBuild.configure(platform, opts.appId || await selectApp(), { debug: !opts.release });


}
