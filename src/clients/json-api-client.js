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
  const req = new Request(url, {
    ...opts,
    method: method,
    headers: {
      ...opts.headers,
      ...jsonApiHeaders
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

export function del(uri) {
  return execute('delete', uri);
}

export function post(url, body = null, opts = {}) {
  if (body) {
    return execute('post', url, {
      ...opts,
      body: JSON.stringify(body)
    });
  }

  return execute('post', url, opts);
}

export function getClient(method, url) {
  return superagent[method](url).set('Accept', 'application/vnd.api+json');
}
