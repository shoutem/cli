import URI from 'urijs';
import { post } from './json-api-client';
import services from '../../config/services';
import * as cache from '../extension/cache-env';
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
  constructor(url, response, statusCode) {
    this.message = 'Username or password is not valid';
    this.url = url;
    this.response = response;
    this.statusCode = statusCode;
  }
}

const tokensUrl = new URI(services.authService).segment('/v1/auth/tokens').toString();

function getBasicAuthHeaderValue(email, password) {
  return 'Basic ' + new Buffer(`${email}:${password}`).toString('base64');
}

export async function createRefreshToken(email, password) {
  try {
    const response = await post(tokensUrl, null, {
      headers: {
        Authorization: getBasicAuthHeaderValue(email, password)
      }
    });
    const { token } = response;
    return token;

  } catch (err) {
    if (err.statusCode === 401) {
      throw new UnauthorizedError(err.url, err.response, err.statusCode);
    }
    throw err;
  }
}

export async function createAppAccessToken(appId, refreshToken) {
  const body = {
    data: {
      type: 'shoutem.auth.tokens',
      attributes: {
        tokenType: 'access-token',
        subjectType: 'application',
        subjectId: appId.toString()
      }
    }
  };

  const { token } = await post(tokensUrl, body, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  });

  return token;
}

export async function getRefreshToken({ email, password } = {}) {
  if (email && password) {
    const refreshToken = await cache.setValue('refresh-token', await createRefreshToken(email, password));
    await cache.setValue('access-token', null);
    return refreshToken;
  }

  return await cache.getValue('refresh-token');
}

export async function clearTokens() {
  await cache.setValue('access-token', null);
  await cache.setValue('refresh-token', null);
}

const authorizationConfig = {
  createAccessTokenRequest(refreshToken) {
    logger.info('createAccessTokenRequest', refreshToken);
    return new Request(tokensUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'shoutem.auth.tokens',
          attributes: {
            tokenType: 'access-token'
          }
        }
      })
    });
  },
  async parseAccessToken(response) {
    if (response.ok) {
      const { data: { attributes: { token } } } = await response.json();
      await cache.setValue('access-token', token);
      return token;
    }
    logger.info('parseAccessToken', response);
    throw new AuthServiceError('Could not get access token', tokensUrl, response, 'ACCESS_TOKEN_FAILURE');
  },
  shouldIntercept(request) {
    return !request.headers.get('Authorization');
  },
  shouldInvalidateAccessToken() {
    return false;
  },
  authorizeRequest(request, accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    logger.info('authorizeRequest', request.headers);
    return request;
  },
  isResponseUnauthorized({ status }) {
    return status === 401 || status === 403;
  },
  shouldWaitForTokenRenewal: true
};

export async function authorizeRequests(refreshToken) {
  if (!refreshToken) {
    return;
  }
  try {
    const intercept = require('@shoutem/fetch-token-intercept');
    intercept.configure(authorizationConfig);
    intercept.authorize(refreshToken, await cache.getValue('access-token'));
    return true;
  } catch (err) {
    logger.info(err);
    if (err.statusCode !== 401) {
      throw err;
    }
    return false;
  }
}
