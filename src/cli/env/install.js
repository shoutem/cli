/* eslint no-console: 0 */
import { installMobileEnv, loadMobilePackageJson } from '../../clients/mobile-env';
import msg from '../../user_messages';
import request from 'request-promise-native';
import apiUrls from '../../../config/services';
import { getHostEnvName } from '../../clients/server-env';
import { ensureNodeVersion } from '../../extension/node';
import { ensureYarnInstalled } from '../../extension/yarn';

export const description = 'Get and setup shoutem mobile env';
export const command = 'install';
export const builder = {
  force: {
    alias: 'f',
    description: 'Delete current env if it exists and force a new install. ' +
      'You can also force a specific version to install.'
  }
};

const mobileAppRegistryRequestOptions = {
  uri: apiUrls.mobileAppUri,
  json: true
};

export async function handler(args) {
  try {
    await ensureNodeVersion();
    await ensureYarnInstalled();

    const localVersion = (await loadMobilePackageJson() || {}).version;
    const registry = await request(mobileAppRegistryRequestOptions);
    const targetVersion = typeof(args.force) === 'string' ? args.force : selectMobileAppVersion(registry);

    if (!args.force && localVersion === targetVersion) {
      console.log(msg.env.update.alreadyLatest(localVersion));
      return;
    }

    if (!registry.versions[targetVersion]) {
      console.error(`Version ${targetVersion} does not exist.`);
      return;
    }

    const tarballUrl = registry.versions[targetVersion].dist.tarball;

    console.log(msg.env.info.downloading(targetVersion));
    await installMobileEnv(tarballUrl);

    const pkgJson = await loadMobilePackageJson();
    console.log(msg.env.install.complete(pkgJson));
  } catch (err) {
    console.error(err.message || err)
  }
}

export function selectMobileAppVersion(mobileAppRegistry) {
  const hostEnv = getHostEnvName();
  const tags = mobileAppRegistry['dist-tags'];

  if (hostEnv === 'local' || hostEnv === 'dev') {
    return tags.dev;
  }

  if (hostEnv === 'beta') {
    return tags.beta;
  }

  if (hostEnv === 'production') {
    return tags.production;
  }

  throw Error(`Unsupported environment ${hostEnv}`);
}
