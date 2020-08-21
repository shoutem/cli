import FormData from 'form-data';
import URI from 'urijs';

import { extensionManager } from '../../config/services';
import listenStream from '../services/stream-listener';
import * as jsonApi from './json-api-client';

const extensionManagerUri = new URI(extensionManager);

export async function getDeveloper() {
  const url = extensionManagerUri.clone().segment('/v1/devs/me');
  return jsonApi.get(url);
}

export async function createDeveloper(devName) {
  const url = extensionManagerUri.clone().segment('/v1/devs');

  return jsonApi.post(url, {
    data: {
      type: 'shoutem.core.developers',
      attributes: { name: devName },
    },
  });
}

export async function uploadExtension(canonicalName, tgzStream, progressHandler, size) {
  // a temporary workaround, forces access token to refresh
  await getDeveloper();

  if (progressHandler) {
    listenStream(tgzStream, progressHandler, size);
  }

  const uri = extensionManagerUri.clone().segment(`/v1/extensions/${canonicalName}`);
  const form = new FormData();
  form.append('extension', tgzStream, {
    contentType: 'application/gzip',
  });

  const { id } = await jsonApi.put(uri, null, {
    body: form,
    headers: form.getHeaders(),
  });

  return id;
}

export async function getExtension(canonicalName) {
  const url = extensionManagerUri.clone().segment(`/v1/extensions/${canonicalName}`);
  return jsonApi.get(url);
}

export async function getExtensionId(canonicalName) {
  const { id } = await getExtension(canonicalName);

  return id;
}

export async function publishExtension(canonicalName) {
  const url = extensionManagerUri.clone().segment(`/v1/extensions/${canonicalName}/publish`);
  return jsonApi.post(url);
}

export async function getPlatforms() {
  const url = extensionManagerUri.clone().segment('/v1/platforms');
  return jsonApi.get(url);
}

export async function canPublish(canonical) {
  try {
    const { tag } = await getExtension(canonical);
    return tag === 'develop';
  } catch (e) {
    if (e.statusCode === 404) {
      return true;
    }
    throw e;
  }
}

export async function uploadPlatform() {
  // TODO: create uploadPlatform function
}

export async function publishPlatform() {
  // TODO: create publishPlatform function
}
