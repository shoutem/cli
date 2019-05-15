import URI from 'urijs';
import { configure, authorize } from '@shoutem/fetch-token-intercept';

import logger from '../services/logger';
import cache from '../services/cache-env';
import services from '../../config/services';
import jsonApi from './json-api-client';

class AuthServiceError {
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

class UnauthorizedError {
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
const appAccessTokenUrl = new URI(services.legacyService).segment('/v1/auth/tokens').toString();

function getBasicAuthHeaderValue(email, password) {
  return 'Basic ' + new Buffer(`${email}:${password}`).toString('base64');
}

async function createRefreshToken(email, password) {
  try {
    const response = await jsonApi.post(tokensUrl, null, {
      headers: {
        Authorization: getBasicAuthHeaderValue(email, password),
      },
    });

    return response.token;
  } catch (err) {
    if (err.statusCode === 401) {
      throw new UnauthorizedError(err.url, err.response, err.statusCode);
    }
    throw err;
  }
}

async function createAppAccessToken(appId, refreshToken) {
  const body = {
    data: {
      type: 'shoutem.auth.tokens',
      attributes: {
        tokenType: 'access-token',
        subjectType: 'application',
        subjectId: appId.toString(),
      },
    },
  };

  const { token } = await jsonApi.post(appAccessTokenUrl, body, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return token;
}

async function getRefreshToken({ email, password } = {}) {
  if (email && password) {
    const refreshToken = await createRefreshToken(email, password);
    cache.setValue('refresh-token', refreshToken);
    cache.setValue('access-token', null);
    return refreshToken;
  }

  return cache.getValue('refresh-token');
}

function clearTokens() {
  cache.setValue('access-token', null);
  cache.setValue('refresh-token', null);
}

const authorizationConfig = {
  createAccessTokenRequest(refreshToken) {
    logger.info('createAccessTokenRequest', refreshToken);
    return new Request(tokensUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'shoutem.auth.tokens',
          attributes: {
            tokenType: 'access-token',
          },
        },
      }),
    });
  },
  async parseAccessToken(response) {
    if (response.ok) {
      const { data: { attributes: { token } } } = await response.json();
      cache.setValue('access-token', token);
      return token;
    }
    logger.info('parseAccessToken', response);
    throw new AuthServiceError('Could not get access token', tokensUrl, response, 'ACCESS_TOKEN_FAILURE');
  },
  shouldIntercept(request) {
    return !request.headers.get('Authorization') && new URI(request.url).host() !== 'github.com';
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
  shouldWaitForTokenRenewal: true,
};

function authorizeRequests(refreshToken) {
  if (!refreshToken) {
    return undefined;
  }

  try {
    const accessToken = cache.getValue('access-token');
    configure(authorizationConfig);
    authorize(refreshToken, accessToken);
    return true;
  } catch (err) {
    logger.info(err);

    if (err.statusCode !== 401) {
      throw err;
    }

    return false;
  }
}

export default {
  AuthServiceError,
  UnauthorizedError,
  createRefreshToken,
  createAppAccessToken,
  getRefreshToken,
  clearTokens,
  authorizeRequests,
};
