import _ from 'lodash';
import request from 'request';
import URI from 'urijs';
import * as jsonApi from './json-api-client';
import services from '../../config/services';

export class AppManagerError {
  /*
    Used whenever AppManager misbehaves and returns errors not listed in
    the API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from AppManager';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

export class AppManagerClient {
  /*
    Client for AppManager service.
  */
  constructor(apiToken, appId, appManagerUri = services.appManager) {
    this.apiToken = apiToken;
    this.appId = appId;
    this.serviceUri = new URI(appManagerUri);

    this.prepareCreateAppRequest.bind(this);
    this.createApp.bind(this);
    this.prepareInstallExtensionRequest.bind(this);
    this.installExtension.bind(this);
    this.getApplicationPlatform.bind(this);
  }

  prepareInstallExtensionRequest(extensionId) {
    return {
      json: true,
      method: 'POST',
      uri: new URI(this.serviceUri).segment(`/v1/apps/${this.appId}/installations`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'shoutem.core.installations',
          attributes: { extension: extensionId },
        },
      },
    };
  }

  /*
    Install extension with given `extensionId`.
  */
  installExtension(extensionId, callback) {
    const settings = this.prepareInstallExtensionRequest(extensionId);

    request(settings, (err, res, body) => {
      if (err) return callback(err);

      if (res.statusCode === 201) {
        const installationId = _.get(body, 'data.id');
        if (installationId) return callback(null, installationId);
      }

      return callback(new AppManagerError(settings, res.statusCode, body));
    });
  }

  uninstallExtension(extensionId) {
    const uri = new URI(this.serviceUri).segment(`/v1/apps/${this.appId}/installations/${extensionId}`).toString();
    return jsonApi.del(uri, this.apiToken);
  }

  async getExtInstallations() {
    const uri = new URI(this.serviceUri).segment(`/v1/apps/${this.appId}/installations`).toString();
    try {
      return await jsonApi.get(uri, this.apiToken);
    } catch (err) {
      throw new Error(err.response.body.errors[0].detail);
    }
  }

  /*
    Create a new app by cloning an existing base app.
  */
  prepareCreateAppRequest(app) {
    return {
      json: true,
      method: 'POST',
      uri: new URI(this.serviceUri).segment('/v1/apps/base/actions/clone').toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'shoutem.core.application-clones',
          attributes: app,
        },
      },
    };
  }

  createApp(app, callback) {
    const settings = this.prepareCreateAppRequest(app);

    request(settings, (err, res, body) => {
      /* eslint no-param-reassign: 0 */
      if (err) return callback(err);

      // should be 201 according to docs...
      if (res.statusCode === 200 || res.statusCode === 201) {
        const appId = _.get(body, 'data.id');
        if (appId) {
          app.id = appId;
          return callback(null, app);
        }
      }
      return callback(new AppManagerError(settings, res.statusCode, body));
    });
  }

  async getApplicationPlatform() {
    const url = new URI(this.serviceUri).segment(`/v1/apps/${this.appId}/platform`).toString();
    return (await jsonApi.get(url, this.apiToken)).data;
  }
}
