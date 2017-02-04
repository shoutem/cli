import request from 'request';
import URI from 'urijs';
import bluebird from 'bluebird';
import services from '../../config/services';


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

export class LegacyServiceClient {
  /*
    Client for LegacyService.
  */
  constructor(apiToken, legacyServiceUri = services.legacyService) {
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
        Authorization: `Bearer ${this.apiToken}`,
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
    return bluebird.promisify(callback => this.getLatestApps(callback))();
  }
}
