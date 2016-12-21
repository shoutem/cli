import superagentJsonapify from 'superagent-jsonapify';
import superagent from 'superagent';

superagentJsonapify(superagent);

export class JsonApiError {
  constructor(errors, request = {}) {
    this.errors = errors;
    this.request = request;
  }
}

function authorize(req, apiToken) {
  return req
    .set('Authorization', `Bearer ${apiToken}`)
    .set('Accept', 'application/vnd.api+json');
}

export async function execute(method, uri, apiToken) {
  const response = await authorize(superagent[method](uri), apiToken);
  return response.body;
}

export function get(uri, apiToken) {
  return execute('get', uri, apiToken);
}

export function del(uri, apiToken) {
  return execute('delete', uri, apiToken);
}
