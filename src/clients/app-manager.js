import URI from 'urijs';
import * as jsonApi from './json-api-client';
import { appManager } from '../../config/services';

const appManagerUri = new URI(appManager);

export async function installExtension(appId, extensionId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return await jsonApi.post(url, {
    data: {
      type: 'shoutem.core.installations',
      attributes: { extension: extensionId },
    },
  });
}

export async function updateExtension(appId, installationId, extensionId) {
  const url = appManagerUri
    .clone()
    .segment(`/v1/apps/${appId}/installations/${installationId}`);
  return await jsonApi.patch(url, {
    data: {
      type: 'shoutem.core.installations',
      attributes: { extension: extensionId },
    },
  });
}

export async function uninstallExtension(appId, extensionId) {
  const uri = appManagerUri
    .clone()
    .segment(`/v1/apps/${appId}/installations/${extensionId}`);
  return jsonApi.del(uri);
}

export async function getExtInstallations(appId) {
  const uri = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return await jsonApi.get(uri);
}

export async function createApp(app) {
  const url = appManagerUri.clone().segment('/v1/apps/base/actions/clone');
  return await jsonApi.post(url, {
    data: {
      type: 'shoutem.core.application-clones',
      attributes: app,
    },
  });
}

export async function getApplicationPlatform(appId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/platform`);
  return await jsonApi.get(url);
}

export async function getInstallations(appId) {
  const url = appManagerUri.clone().segment(`/v1/apps/${appId}/installations`);
  return await jsonApi.get(url);
}

export async function getInstallation(appId, canonical) {
  const url = appManagerUri
    .clone()
    .segment(`/v1/apps/${appId}/installations/${canonical}`);
  return await jsonApi.get(url);
}
