import sinon from 'sinon';
import { assert } from 'chai';

import {
  loginUser,
  ensureUserIsLoggedIn,
  __Rewire__,
  __ResetDependency__,
} from '../login';


describe('Commands: login', () => {
  describe('loginUser', () => {
    function getCreds() {
      return {
        username: 'joe',
        password: 'moe',
      };
    }

    afterEach(() => {
      __ResetDependency__('promptUserCredentials');
      __ResetDependency__('LocalDataClient');
      __ResetDependency__('AuthServiceClient');
    });

    it('returns an error if prompt fails', done => {
      __Rewire__('promptUserCredentials',
        sinon.stub().callsArgWith(0, new Error('prompt failure')));

      loginUser((err, token) => {
        try {
          assert.strictEqual(err.message, 'prompt failure');
          assert.isUndefined(token);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('returns an error if credentials verification fails', done => {
      __Rewire__('promptUserCredentials',
        sinon.stub().callsArgWith(0, null, getCreds()));

      __Rewire__('AuthServiceClient', () => ({
        loginUser: sinon.stub().callsArgWith(2, new Error('login failure')),
      }));

      loginUser((err, token) => {
        try {
          assert.strictEqual(err.message, 'login failure');
          assert.isUndefined(token);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('returns an error if saving the token fails', done => {
      __Rewire__('promptUserCredentials',
        sinon.stub().callsArgWith(0, null, getCreds()));

      __Rewire__('AuthServiceClient', () => ({
        loginUser: sinon.stub().callsArgWith(2, null, 'some-api-token'),
      }));

      __Rewire__('LocalDataClient', () => ({
        saveApiToken: sinon.stub().callsArgWith(1, new Error('save token failure')),
      }));

      loginUser((err, token) => {
        try {
          assert.strictEqual(err.message, 'save token failure');
          assert.isUndefined(token);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('returns the API token if everything works', done => {
      __Rewire__('promptUserCredentials',
        sinon.stub().callsArgWith(0, null, getCreds()));

      __Rewire__('AuthServiceClient', () => ({
        loginUser: sinon.stub().callsArgWith(2, null, 'some-api-token'),
      }));

      __Rewire__('LocalDataClient', () => ({
        saveApiToken: sinon.stub().callsArgWith(1, null, 'some-api-token'),
      }));

      loginUser((err, token) => {
        try {
          assert.isNull(err);
          assert.strictEqual(token, 'some-api-token');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('ensureUserIsLoggedIn', () => {
    afterEach(() => {
      __ResetDependency__('LocalDataClient');
      __ResetDependency__('loginUser');
    });

    it('returns the token from file system if it exists', done => {
      __Rewire__('LocalDataClient', () => ({
        loadApiToken: sinon.stub().callsArgWith(0, null, 'existing-token'),
      }));

      ensureUserIsLoggedIn((err, token) => {
        try {
          assert.isNull(err);
          assert.strictEqual(token, 'existing-token');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('returns a new token from auth service', done => {
      __Rewire__('LocalDataClient', () => ({
        loadApiToken: sinon.stub().callsArgWith(0, null, null),
      }));

      __Rewire__('loginUser', sinon.stub().callsArgWith(0, null, 'fresh-token'));

      ensureUserIsLoggedIn((err, token) => {
        try {
          assert.isNull(err);
          assert.strictEqual(token, 'fresh-token');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
