import _ from 'lodash';
import u from 'underscore';
import request from 'request';
import URI from 'urijs';
import request2 from 'request-promise';
import services from '../../config/services';
import bluebird from 'bluebird';
import { listenStream } from '../extension/stream-listener';


export class ExtensionManagerError {
  /*
    Used whenever ExtensionManager misbehaves and returns errors not listed in
    the API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from ExtensionManager';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

export class DeveloperNameError {
  /*
    Used when developer tries to register with a name which is not unique.
  */
  constructor(devName) {
    this.message = `Name "${devName}" is already taken`;
  }
}


export class ExtensionManagerClient {
  /*
    Client for ExtensionManager service.
    https://github.com/shoutem/docs/tree/feature/api-for-em/api-specs/ExtensionManager
  */
  constructor(apiToken, extensionManagerUri = services.extensionManager) {
    this.apiToken = apiToken;
    this.serviceUri = new URI(extensionManagerUri);
  }

  prepareGetDeveloperRequest() {
    return {
      json: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment('/v1/devs/me').toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      simple: false,
      resolveWithFullResponse: true,
    };
  }

  /*
    Get developer information based on his/her API token.
  */
  getDeveloper() {
    const settings = this.prepareGetDeveloperRequest();

    return request2(settings)
      .then(res => {
        if (res.statusCode === 404) {
          return null;
        }

        const dev = {
          id: _.get(res.body, 'data.id'),
          name: _.get(res.body, 'data.attributes.name'),
        };

        if (res.statusCode !== 200 || !dev.id || !dev.name) {
          return Promise.reject(new ExtensionManagerError(settings, res.statusCode, res.body));
        }

        return dev;
      });
  }

  prepareCreateDeveloperRequest(devName) {
    return {
      json: true,
      method: 'POST',
      uri: new URI(this.serviceUri).segment('/v1/devs').toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'shoutem.core.developers',
          attributes: { name: devName },
        },
      },
      simple: false,
      resolveWithFullResponse: true,
    };
  }

  /*
    Create a new developer with given `devName`.
  */
  createDeveloper(devName) {
    const settings = this.prepareCreateDeveloperRequest(devName);

    return request2(settings)
      .then(res => {
        if (res.statusCode === 409) {
          return Promise.reject(new DeveloperNameError(devName));
        }

        const dev = {
          id: _.get(res.body, 'data.id'),
          name: _.get(res.body, 'data.attributes.name'),
        };


        if (!u.contains([201, 200], res.statusCode) || !dev.id || !dev.name) {
          return Promise.reject(new ExtensionManagerError(settings, res.statusCode, res.body));
        }

        return dev;
      });
  }

  prepareGetExtensionIdRequest(canonicalName) {
    return {
      json: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment(`/v1/extensions/${canonicalName}`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
      },
    };
  }

  getExtensionIdAsync(canonicalName) {
    const getExtensionId = bluebird.promisify((name, callback) => this.getExtensionId(name, callback));

    return getExtensionId(canonicalName);
  }

  getExtensionId(canonicalName, callback) {
    const settings = this.prepareGetExtensionIdRequest(canonicalName);

    request(settings, (err, res, body) => {
      if (err) return callback(err);

      if (res.statusCode === 404) return callback(null, null);

      if (res.statusCode === 200) {
        const extensionId = _.get(body, 'data.id');
        if (extensionId) return callback(null, extensionId);
      }

      return callback(new ExtensionManagerError(settings, res.statusCode, body));
    });
  }

  prepareUploadExtensionZipRequest(canonicalName, zipStream) {
    return {
      json: false,
      method: 'PUT',
      uri: new URI(this.serviceUri).segment(`/v1/extensions/${canonicalName}`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'multipart/form-data',
      },
      formData: {
        extension: {
          value: zipStream,
          options: { contentType: null },
        },
      },
      simple: false,
      resolveWithFullResponse: true,
    };
  }

  /*
    Upload zipped extension.
  */
  uploadExtension(canonicalName, zipStream, progressHandler, size) {

    if (progressHandler) {
      listenStream(zipStream, progressHandler, size);
    }

    const settings = this.prepareUploadExtensionZipRequest(canonicalName, zipStream);

    return request2(settings)
      .then(res => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          return _.get(JSON.parse(res.body), 'data.id');
        }
        return Promise.reject(new ExtensionManagerError(settings, res.statusCode, res.body));
      });
  }

  preparePublishExtensionRequest(canonicalName) {
    return {
      json: true,
      method: 'POST',
      uri: new URI(this.serviceUri).segment(`/v1/extensions/${canonicalName}/publish`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      simple: false,
      resolveWithFullResponse: true,
    };
  }

  prepareExtensionGetRequest(canonicalName) {
    return {
      json: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment(`/v1/extensions/${canonicalName}`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      simple: false,
      resolveWithFullResponse: true,
    };
  }

  /*
    Publish extension with given `canonicalName`.
  */
  async publishExtension(canonicalName) {
    const { statusCode, body } = await request2(this.prepareExtensionGetRequest(canonicalName));
    if (statusCode === 200 && body.data.attributes.published) {
      throw new Error('Can\'t publish because current version is already published');
    }

    const settings = this.preparePublishExtensionRequest(canonicalName);

    const res = await request2(settings);
    if (res.statusCode === 200 || res.statusCode === 201) {
      return (res.body || {}).data;
    } else {
      throw new ExtensionManagerError(settings, res.statusCode, res.body);
    }
  }

  async getPlatforms() {
    const requestOptions = {
      json: true,
      method: 'GET',
      uri: new URI(this.serviceUri).segment('/v1/platforms').toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      simple: false,
      resolveWithFullResponse: true,
    };

    const res = await request2(requestOptions);
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      throw new ExtensionManagerError(requestOptions, res.statusCode, res.body);
    }

    return res.body.data;
  }
}
