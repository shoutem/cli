import request from 'request';
import requestPromise from 'request-promise';
import URI from 'urijs';
import Promise from 'bluebird';
import { legacyService } from '../../config/services';
import * as jsonApi from './json-api-client';

export class LegacyServiceError {
  /*
    Used whenever LegacyService misbehaves and returns errors not listed in
    the API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from LegacyService';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

export async function getLatestApps() {
  const body = await jsonApi.get(new URI(legacyService).segment('/v1/apps').toString());
  return body.data;
}

export class LegacyServiceClient {
  /*
    Client for LegacyService.
  */
  constructor(apiToken, legacyServiceUri = legacyService) {
    this.apiToken = apiToken;
    this.serviceUri = new URI(legacyServiceUri);

    this.prepareGetLatestAppsRequest.bind(this);
    this.getLatestApps.bind(this);
    this.getLatestAppsAsync.bind(this);
  }

  prepareGetLatestAppsRequest(limit = 20) {
    return {
      json: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment('/v1/apps').toString(),
      qs: {
        'page[limit]': limit,
        'page[offset]': 0,
        sort: '-modificationTime',
      },
      headers: {
        Accept: 'application/vnd.api+json',
        //Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
    };
  }

  getLatestApps(callback) {
    const settings = this.prepareGetLatestAppsRequest();

    request(settings, (err, res, body) => {
      if (err) return callback(err);

      if (res.statusCode === 200 && body.data) {
        const apps = body.data.map(app => ({
          id: app.id,
          name: app.attributes.name,
        }));
        return callback(null, apps);
      }

      return callback(new LegacyServiceError(settings, res.statusCode, body));
    });
  }

  async getLatestAppsAsync() {
    return Promise.promisify(callback => this.getLatestApps(callback))();
  }

  async getApp(appId) {
    const settings = {
      json: true,
      resolveWithFullResponse: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment(`/v1/apps/${appId}`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        //Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
    };

    const res = await requestPromise(settings);
    const { statusCode, body } = res;

    if (statusCode !== 200) {
      throw new LegacyServiceError(settings, statusCode, body);
    }

    return body.data;
  }

  async getPublishingProperties(appId) {
    const settings = {
      json: true,
      resolveWithFullResponse: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment(`/api/applications/publishing_properties.json`).search({ nid: appId }).toString(),
      headers: {
        Accept: 'application/json',
        //Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      }
    };

    const res = await requestPromise(settings);
    const { statusCode, body } = res;
    if (statusCode !== 200) {
      throw new LegacyServiceError(settings, statusCode, body);
    }

    return body;
  }
}
