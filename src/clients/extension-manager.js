import URI from 'urijs';
import { extensionManager } from '../../config/services';
import { listenStream } from '../extension/stream-listener';
import * as jsonApi from './json-api-client';
import FormData from 'form-data';

const extensionManagerUri = new URI(extensionManager);

export class ExtensionManagerError {
  /*
    Used whenever ExtensionManager misbehaves and returns errors not listed in
    the API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from ExtensionManager';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

export async function getDeveloper() {
  const url = extensionManagerUri.segment('/v1/devs/me');
  const { data } = await jsonApi.get(url);

  return { ...data.attributes, id: data.id };
}

export async function createDeveloper(devName) {
  const url = extensionManagerUri.segment('/v1/devs');

  const { data } = await jsonApi.post(url, {
    data: {
      type: 'shoutem.core.developers',
      attributes: { name: devName },
    },
  });

  return { ...data.attributes, id: data.id };
}

export async function uploadExtension(canonicalName, tgzStream, progressHandler, size) {
  if (progressHandler) {
    listenStream(tgzStream, progressHandler, size);
  }

  const uri = extensionManagerUri.segment(`/v1/extensions/${canonicalName}`);
  const form = new FormData();
  form.append('extension', tgzStream);

  const { data: id } = await jsonApi.put(uri, null, {
    body: form,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return id;
}

export async function getExtensionId(canonicalName) {
  const { id } = await getExtension(canonicalName);

  return id;
}

export async function getExtension(canonicalName) {
  const url = extensionManagerUri.segment(`/v1/extensions/${canonicalName}`);
  const { data } = await jsonApi.get(url);
  return data;
}

export async function publishExtension(canonicalName) {
  const url = extensionManagerUri.segment(`/v1/extensions/${canonicalName}/publish`);
  return await jsonApi.post(url);
}

export async function getPlatforms() {
  const url = extensionManagerUri.segment('/v1/platforms');
  const { data } = await jsonApi.get(url);

  return data;
}

export class DeveloperNameError {
  /*
    Used when developer tries to register with a name which is not unique.
  */
  constructor(devName) {
    this.message = `Name "${devName}" is already taken`;
  }
}
