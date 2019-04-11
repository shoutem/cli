import URI from 'urijs';
import * as jsonApi from './json-api-client';
import { appManager } from '../../config/services';
import { getDeveloper } from './extension-manager';

const appManagerUri = new URI(appManager);

export function installExtension(appId, extensionId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return jsonApi.post(url, {
    data: {
      type: 'shoutem.core.installations',
      attributes: { extension: extensionId },
    },
  });
}

export function updateExtension(appId, installationId, extensionId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations/${installationId}`);
  return jsonApi.patch(url, {
    data: {
      type: 'shoutem.core.installations',
      attributes: { extension: extensionId },
    },
  });
}

export function uninstallExtension(appId, extensionId) {
  const uri = appManagerUri.clone().segment(`/v1/apps/${appId}/installations/${extensionId}`);
  return jsonApi.del(uri);
}

export function getExtInstallations(appId) {
  const uri = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return jsonApi.get(uri);
}

export function createApp(app) {
  const url = appManagerUri.clone().segment('/v1/apps/base/actions/clone');
  return jsonApi.post(url, {
    data: {
      type: 'shoutem.core.application-clones',
      attributes: app,
    },
  });
}

export function getApplicationPlatform(appId, plain = false) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/platform`);
  return jsonApi.get(url, { plain });
}

export function getInstallations(appId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return jsonApi.get(url);
}

export function getInstallation(appId, canonical) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations/${canonical}`);
  return jsonApi.get(url);
}

export async function installApplicationPlatform(appId, platformId) {
  // a temporary workaround, forces access token to refresh
  await getDeveloper();

  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/platform/actions/migrate`);

  return jsonApi.post(url, {
    data: {
      type: 'shoutem.core.platform-installation-migrations',
      attributes: {},
      relationships: {
        platform: {
          data: {
            type: 'shoutem.core.platforms',
            id: platformId,
          },
        },
      },
    },
  });
}
