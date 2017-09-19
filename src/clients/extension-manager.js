import URI from 'urijs';
import { extensionManager } from '../../config/services';
import { listenStream } from '../services/stream-listener';
import * as jsonApi from './json-api-client';
import FormData from 'form-data';

const extensionManagerUri = new URI(extensionManager);

export async function getDeveloper() {
  const url = extensionManagerUri.clone().segment('/v1/devs/me');
  return await jsonApi.get(url);
}

export async function createDeveloper(devName) {
  const url = extensionManagerUri.clone().segment('/v1/devs');

  return await jsonApi.post(url, {
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
    contentType: 'application/gzip'
  });

  try {

    const {id} = await jsonApi.put(uri, null, {
      body: form,
      headers: form.getHeaders()
    });

    return id;
  } catch (e) {
    console.log(e);
  }
}

export async function getExtensionId(canonicalName) {
  const { id } = await getExtension(canonicalName);

  return id;
}

export async function getExtension(canonicalName) {
  const url = extensionManagerUri.clone().segment(`/v1/extensions/${canonicalName}`);
  return await jsonApi.get(url);
}

export async function publishExtension(canonicalName) {
  const url = extensionManagerUri.clone().segment(`/v1/extensions/${canonicalName}/publish`);
  return await jsonApi.post(url);
}

export async function getPlatforms() {
  const url = extensionManagerUri.clone().segment('/v1/platforms');
  return await jsonApi.get(url);
}

export class DeveloperNameError {
  /*
    Used when developer tries to register with a name which is not unique.
  */
  constructor(devName) {
    this.message = `Name "${devName}" is already taken`;
  }
}
