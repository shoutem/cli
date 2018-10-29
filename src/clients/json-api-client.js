import _ from 'lodash';
import { Deserializer } from 'jsonapi-serializer';
import * as logger from '../services/logger';

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase'
});

// jsonapi-serializer seems to ignore non-included relationships no matter what its docs say
// therefore, support an option to use our own deserialization when specified(default still jsonapi-serializer)
function deserializePlainSingle(json) {
  const relationships = json.relationships;
  const relationshipKeys = _.keys(relationships);

  const relationshipIds = {};
  _.forEach(relationshipKeys, key => {
    relationshipIds[key] = _.get(relationships[key], 'data.id');
  })

  return {
    ...relationshipIds,
    ...json.attributes,
  };
}

function deserializePlain(json) {
  if (!json) {
    return null;
  }

  const data = json.data;

  if (_.isArray(data)) {
    return _.map(data, item => deserializePlainSingle(item));
  }

  return deserializePlainSingle(data);
}

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
  const textResponse = await response.text();

  if (!textResponse) {
    return null;
  }

  const json = JSON.parse(textResponse);
  if (opts.plain) {
    return deserializePlain(json);
  }

  if (response.ok) {
    
    try {
      const deserialized = await deserializer.deserialize(json);

      return deserialized;
    } catch (err) {
      // if non json-api object is returned, use the object as-is
      return json;
    }
  }

  delete response._raw;
  throw new JsonApiError(null, req, json, response, response.status);
}

export function get(uri, opts = {}) {
  return execute('get', uri, opts);
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

export function patch(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('patch', url, {
      ...opts,
      body: JSON.stringify(jsonBody)
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
      body: JSON.stringify(jsonBody)
    });
  }

  return execute('post', url, opts);
}
