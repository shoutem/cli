import URI from 'urijs';
import * as jsonApi from './json-api-client';
import { appManager } from '../../config/services';

export class AppManagerError {
  /*
    Used whenever AppManager misbehaves and returns errors not listed in
    the API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from AppManager';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

const appManagerUri = new URI(appManager);

export async function installExtension(appId, extensionId) {
  const url = appManagerUri.segment(`/v1/apps/${appId}/installations`);
  return await jsonApi.post(url, {
    data: {
      type: 'shoutem.core.installations',
      attributes: { extension: extensionId },
    }
  });
}

export async function uninstallExtension(appId, extensionId) {
  const uri = appManagerUri.segment(`/v1/apps/${appId}/installations/${extensionId}`);
  return jsonApi.del(uri);
}

export async function getExtInstallations(appId) {
  const uri = appManagerUri.segment(`/v1/apps/${appId}/installations`);
  return await jsonApi.get(uri);
}

export async function createApp(app) {
  const url = appManagerUri.segment('/v1/apps/base/actions/clone');
  return await jsonApi.post(url, {
    data: {
      type: 'shoutem.core.application-clones',
      attributes: app,
    },
  });
}

export async function getApplicationPlatform(appId) {
  const url = appManagerUri.segment(`/v1/apps/${appId}/platform`);
  const { data } = await jsonApi.get(url);
  return data;
}

export async function getInstallations(appId) {
  const url = appManagerUri.segment(`/v1/apps/${appId}/installations`);
  const { data } = await jsonApi.get(url);
  return data;
}
