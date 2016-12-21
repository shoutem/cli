import _ from 'lodash';
import request from 'request-promise';
import URI from 'urijs';

import services from '../../config/services';


export class AuthServiceError {
  /*
    Used whenever AuthService misbehaves and returns errors not listed in the
    API specification.
  */
  constructor(reqSettings, resStatus, resBody) {
    this.message = 'Unexpected response from AuthService';
    this.request = reqSettings;
    this.response = {
      body: resBody,
      statusCode: resStatus,
    };
  }
}

export class UnauthorizedError {
  /*
    Used when bad username or password is supplied.
  */
  constructor() {
    this.message = 'Username or password is not valid';
  }
}


export class AuthServiceClient {
  /*
    Client for authenication service.
    https://github.com/shoutem/docs/tree/feature/api-for-em/api-specs/AuthService
  */
  constructor(authServiceUri = services.authService) {
    this.serviceUri = new URI(authServiceUri);
  }

  prepareLoginUserRequest(username, password) {
    const encoded = new Buffer(`${username}:${password}`).toString('base64');
    return {
      json: true,
      method: 'POST',
      uri: new URI(this.serviceUri).segment('/v1/login').toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Basic ${encoded}`,
      },
      resolveWithFullResponse: true,
      simple: false,
    };
  }

  /*
    Passes `username` and `password` to authentication service for validation.
    If credentials are valid, `callback` will receive an API token.
  */
  loginUser(username, password) {
    const settings = this.prepareLoginUserRequest(username, password);
    return request(settings)
      .then(response => {
        const body = response.body;
        if (response.statusCode === 401) {
          return Promise.reject(new UnauthorizedError());
        }

        const apiToken = _.get(body, 'meta.authHeaderToken');
        if (response.statusCode !== 200 || !apiToken) {
          return Promise.reject(new AuthServiceError(settings, 200, body));
        }

        return apiToken;
      });
  }
}
