import superagentJsonapify from 'superagent-jsonapify';
import superagent from 'superagent';
import fetch from 'fetch-everywhere';
import JsonApiSerializer from 'json-api-serializer';

const Serializer = new JsonApiSerializer();

superagentJsonapify(superagent);

export class JsonApiError {
  constructor(errors, request = {}) {
    this.errors = errors;
    this.request = request;
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
  return Serializer.deserialize(json);
}

export function get(uri) {
  return execute('get', uri);
}

export function del(uri) {
  return execute('delete', uri);
}

export function getClient(method, url) {
  return superagent[method](url).set('Accept', 'application/vnd.api+json');
}
