import { Deserializer } from 'jsonapi-serializer';
import * as logger from '../services/logger';

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase',
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
  const resolvedUrl = url.toString();

  const jsonApiHeaders = {
    Accept: 'application/vnd.api+json',
  };
  if (opts.body) {
    jsonApiHeaders['Content-Type'] = 'application/vnd.api+json';
  }

  const req = new Request(resolvedUrl, {
    ...opts,
    method,
    headers: {
      ...jsonApiHeaders,
      ...opts.headers,
    },
  });

  logger.info(`${method} ${resolvedUrl}`, req);
  const response = await fetch(req);
  const textResponse = await response.text();

  if (!textResponse) {
    return null;
  }

  const json = JSON.parse(textResponse);

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
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('put', url, opts);
}

export function patch(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('patch', url, {
      ...opts,
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('patch', url, opts);
}

export function del(uri) {
  return execute('delete', uri);
}

export function post(url, jsonBody = null, opts = {}) {
  if (jsonBody) {
    return execute('post', url, {
      ...opts,
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('post', url, opts);
}
