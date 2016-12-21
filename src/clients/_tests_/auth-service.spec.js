import nock from 'nock';
import { assert } from 'chai';

import { AuthServiceError, UnauthorizedError, AuthServiceClient } from '../auth-service';


describe('AuthServiceClient', () => {
  describe('prepareLoginUserRequest', () => {
    const authServiceUri = 'http://auth.service.com';
    const client = new AuthServiceClient(authServiceUri);

    it('prepares request for user login', () => {
      const settings = client.prepareLoginUserRequest('user', 'pass');
      const encoded = new Buffer('user:pass').toString('base64');
      assert.deepEqual(settings, {
        json: true,
        method: 'POST',
        uri: 'http://auth.service.com/v1/login',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Basic ${encoded}`,
        },
      });
    });
  });

  describe('loginUser', () => {
    const authServiceUri = 'http://auth.service.com';
    const client = new AuthServiceClient(authServiceUri);

    it('returns an error on unspecified response', done => {
      nock(authServiceUri).post('/v1/login').reply(678, {});

      client.loginUser('user', 'pass', (err, token) => {
        try {
          assert(err instanceof AuthServiceError);
          assert.strictEqual(err.response.statusCode, 678);
          assert.isUndefined(token);
          done();
        } catch (exc) {
          done(exc);
        }
      });
    });

    it('returns an error if response has no API token', done => {
      nock(authServiceUri).post('/v1/login').reply(200, { meta: null });

      client.loginUser('user', 'pass', (err, token) => {
        try {
          assert(err instanceof AuthServiceError);
          assert.strictEqual(err.response.body.meta, null);
          assert.isUndefined(token);
          done();
        } catch (exc) {
          done(exc);
        }
      });
    });

    it('returns an error for bad credentials', done => {
      nock(authServiceUri).post('/v1/login').reply(401);

      client.loginUser('user', 'pass', (err, token) => {
        try {
          assert(err instanceof UnauthorizedError);
          assert.isUndefined(token);
          done();
        } catch (exc) {
          done(exc);
        }
      });
    });

    it('returns an API token on successful login', done => {
      nock(authServiceUri).post('/v1/login')
      .reply(200, {
        meta: {
          authHeaderToken: 'A1BD639C97AE',
        },
      });

      client.loginUser('user', 'pass', (err, token) => {
        if (err) return done(err);
        try {
          assert.strictEqual(token, 'A1BD639C97AE');
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });
});
