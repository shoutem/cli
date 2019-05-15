import _ from 'lodash';
import { Deserializer } from 'jsonapi-serializer';
import logger from '../services/logger';

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase',
});

// jsonapi-serializer seems to ignore non-included relationships
// no matter what its docs say therefore, support an option to
// use our own deserialization when specified (default still jsonapi-serializer)
function deserializePlainSingle(json) {
  const { relationships } = json;
  const relationshipKeys = _.keys(relationships);

  const relationshipIds = {};
  _.forEach(relationshipKeys, (key) => {
    relationshipIds[key] = _.get(relationships[key], 'data.id');
  });

  return {
    ...relationshipIds,
    ...json.attributes,
  };
}

function deserializePlain(json) {
  if (!json) {
    return null;
  }

  const { data } = json;

  if (_.isArray(data)) {
    return _.map(data, item => deserializePlainSingle(item));
  }

  return deserializePlainSingle(data);
}

class JsonApiError {
  constructor(message, request, body, response, statusCode) {
    this.message = message;
    this.request = request;
    this.body = body;
    this.response = response;
    this.statusCode = statusCode;
  }
}

async function execute(method, _url, opts = {}) {
  const url = _url.toString();

  const jsonApiHeaders = {
    Accept: 'application/vnd.api+json',
  };
  if (opts.body) {
    jsonApiHeaders['Content-Type'] = 'application/vnd.api+json';
  }

  const req = new Request(url, {
    ...opts,
    method,
    headers: {
      ...jsonApiHeaders,
      ...opts.headers,
    },
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

function get(uri, opts = {}) {
  return execute('get', uri, opts);
}

function put(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('put', url, {
      ...opts,
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('put', url, opts);
}

function patch(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('patch', url, {
      ...opts,
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('patch', url, opts);
}

function del(uri) {
  return execute('delete', uri);
}

function post(url, jsonBody = null, opts = {}) {
  if (jsonBody) {
    return execute('post', url, {
      ...opts,
      body: JSON.stringify(jsonBody),
    });
  }

  return execute('post', url, opts);
}

export default {
  JsonApiError,
  execute,
  get,
  put,
  patch,
  del,
  post,
};
