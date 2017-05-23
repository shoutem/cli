import superagentJsonapify from 'superagent-jsonapify';
import superagent from 'superagent';
import { Deserializer } from 'jsonapi-serializer';

const deserializer = new Deserializer();

superagentJsonapify(superagent);

export class JsonApiError {
  constructor(message, response, body, status) {
    this.message = message;
    this.response = response;
    this.status = status;
    this.body = body;
  }
}

const jsonApiHeaders = {
  Accept: 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json'
};

export async function execute(method, url, opts = {}) {
  const req = new Request(url.toString(), {
    ...opts,
    method: method,
    headers: {
      ...jsonApiHeaders,
      ...opts.headers
    }
  });
  const response = await fetch(req);
  const json = await response.json();
  if (response.ok) {
    return deserializer.deserialize(json);
  }

  throw new JsonApiError(null, response, json, response.status);
}

export function get(uri) {
  return execute('get', uri);
}

export function put(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('put', url, {
      ...opts,
      body: JSON.stringify(jsonBody)
    });
  }

  return execute('put', url, opts);
}

export function del(uri) {
  return execute('delete', uri);
}

export function post(url, jsonBody = null, opts = {}) {
  if (jsonBody) {
    return execute('post', url, {
      ...opts,
      body: JSON.stringify(jsonBody)
    });
  }

  return execute('post', url, opts);
}

export function getClient(method, url) {
  return superagent[method](url).set('Accept', 'application/vnd.api+json');
}
