import URI from 'urijs';
import { getClient } from './json-api-client';
import services from '../../config/services';
import * as cache from '../extension/cache';
import { getHostEnvName } from './server-env';
import * as intercept from '@shoutem/fetch-token-intercept';
import * as logger from '../extension/logger';

export class AuthServiceError {
  /*
    Used whenever AuthService misbehaves and returns errors not listed in the
    API specification.
  */
  constructor(message, url, response, code) {
    this.message = message;
    this.url = url;
    this.response = response;
    this.code = code;
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

const tokensUrl = new URI(services.authService).segment('/v1/auth/tokens').toString();

export async function createRefreshToken(email, password) {
  const response = await getClient('post', tokensUrl).auth(email, password);

  const { body: { data: { tokenType, token } } } = response;

  if (tokenType !== 'refresh-token') {
    throw new AuthServiceError('Did not get refresh token', tokensUrl, response);
  }

  if (!token) {
    throw new AuthServiceError('Got null refresh token', tokensUrl, response);
  }

  return token;
}

function getRefreshTokenKey() {
  return getHostEnvName() + '.refresh-token';
}

function getAccessTokenKey() {
  return getHostEnvName() + '.access-token';
}

export async function getRefreshToken({ email, password } = {}) {
  const refreshToken = await cache.getValue(getRefreshTokenKey());

  if (!refreshToken && email && password) {
    return await cache.setValue(getRefreshTokenKey(), await createRefreshToken(email, password));
  }

  if (!refreshToken) {
    throw new AuthServiceError('Login with email and password required.', null, null, 'LOGIN_REQUIRED');
  }

  return refreshToken;
}

export async function clearTokens() {
  await cache.setValue(getAccessTokenKey(), null);
  await cache.setValue(getRefreshToken(), null);
}

const authorizationConfig = {
  createAccessTokenRequest(refreshToken){
    return new Request(tokensUrl, {
      method: 'POST',
      uri: tokensUrl,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      json: {
        data: {
          type: 'shoutem.auth.tokens',
          attributes: {
            tokenType: 'access-token'
          }
        }
      }
    });
  },
  parseAccessToken(response) {
    logger.info('parseAccessToken', response);
    return response.body.data.accessToken;
  },
  shouldIntercept() {
    return true;
  },
  shouldInvalidateAccessToken() {
    return false;
  },
  authorizeRequest(request, accessToken) {
    logger.info('authorizeRequest', accessToken);
    if (!request.headers.Authorization) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  }
};

export async function authorizeRequests(creds = {}) {
  try {
    const refreshToken = await getRefreshToken(creds);
    intercept.configure(authorizationConfig);
    intercept.authorize(refreshToken, await cache.getValue(getAccessTokenKey()));
    return true;
  } catch (err) {
    logger.info(err);
    if (err.code !== 'LOGIN_REQUIRED') {
      throw err;
    }
    return false;
  }
}

export async function refreshTokenExists() {
  return !!await cache.getValue(getRefreshTokenKey());
}
