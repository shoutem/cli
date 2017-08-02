import { Deserializer } from 'jsonapi-serializer';
import * as logger from '../extension/logger';

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase'
});

export class JsonApiError {
  constructor(message, request, body, response, statusCode) {
    this.message = message;
    this.request = request;
    this.body = body;
    this.response = response;
    this.statusCode = statusCode;
  }
}

export async function execute(method, url, opts = {}) {
  url = url.toString();

  const jsonApiHeaders = {
    Accept: 'application/vnd.api+json',
  };
  if (opts.body) {
    jsonApiHeaders['Content-Type'] = 'application/vnd.api+json';
  }

  const req = new Request(url, {
    ...opts,
    method: method,
    headers: {
      ...jsonApiHeaders,
      ...opts.headers
    }
  });

  logger.info(`${method} ${url}`, req);
  const response = await fetch(req);
  const json = await response.json();
  if (response.ok) {
    try {
      return await deserializer.deserialize(json);
    } catch (err) {
      // if non json-api object is returned, use the object as-is
      return json;
    }
  }

  delete response._raw;
  throw new JsonApiError(null, req, json, response, response.status);
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
