/* eslint no-console: "off" */
import * as mobileEnv from '../clients/mobile-env';
import { mobileAppPath } from '../clients/cli-paths';
import cliUrls from '../../config/services';
import url from 'url';
import * as yarn from '../extension/yarn';
import { ensureYarnInstalled } from '../extension/yarn';
import { ensureNodeVersion } from '../extension/node';

import msg from '../user_messages';

export default async (platform, appId, options = {}) => {
  await ensureNodeVersion();
  await ensureYarnInstalled();

  const config = await mobileEnv.loadMobileConfig();
  if (!config) {
    throw new Error(msg.run.missingConfig());
  }

  if (appId) {
    config.appId = appId;
  } else if (!config.appId) {
    throw new Error(msg.run.missingId());
  }
  config.serverApiEndpoint = url.parse(cliUrls.appManager).hostname;
  await mobileEnv.saveMobileConfig(config);

  console.log(msg.run.info(platform, config));
  await yarn.run(await mobileAppPath(), `run-${platform}`);
  console.log(msg.run.complete(platform));
}
