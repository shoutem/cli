import nock from 'nock';
import { assert } from 'chai';

import { ExtensionManagerError, DeveloperNameError, ExtensionManagerClient } from
 '../extension-manager';


describe('ExtensionManagerClient', () => {
  describe('prepareGetDeveloperRequest', () => {
    const extensionManagerUri = 'http://extensions.service.com';
    const apiToken = '6B3B0B9C1EE0';
    const client = new ExtensionManagerClient(apiToken, extensionManagerUri);

    it('prepares request for getting developer info', () => {
      const settings = client.prepareGetDeveloperRequest();
      assert.deepEqual(settings, {
        json: true,
        method: 'GET',
        uri: `${extensionManagerUri}/v1/devs/me`,
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${apiToken}`,
        },
      });
    });
  });

  describe('getDeveloper', () => {
    const extensionManagerUri = 'http://extensions.service.com';
    const apiToken = '6B3B0B9C1EE0';
    const client = new ExtensionManagerClient(apiToken, extensionManagerUri);

    it('returns an error on unspecified response', done => {
      nock(extensionManagerUri).get('/v1/devs/me').reply(678, {});

      client.getDeveloper((err, dev) => {
        try {
          assert(err instanceof ExtensionManagerError);
          assert.strictEqual(err.response.statusCode, 678);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns an error if response does not contain all info', done => {
      nock(extensionManagerUri).get('/v1/devs/me').reply(200, { data: 0 });

      client.getDeveloper((err, dev) => {
        try {
          assert(err instanceof ExtensionManagerError);
          assert.strictEqual(err.response.body.data, 0);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns null if developer does not exist', done => {
      nock(extensionManagerUri).get('/v1/devs/me').reply(404, {});

      client.getDeveloper((err, dev) => {
        if (err) return done(err);
        try {
          assert.isNull(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns developer information', done => {
      nock(extensionManagerUri).get('/v1/devs/me')
      .reply(200, {
        data: {
          id: 100,
          attributes: {
            name: 'johnny',
            userId: 200,
          },
        },
      });

      client.getDeveloper((err, dev) => {
        if (err) return done(err);
        try {
          assert.strictEqual(dev.id, 100);
          assert.strictEqual(dev.name, 'johnny');
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });

  describe('prepareCreateDeveloperRequest', () => {
    const extensionManagerUri = 'http://extensions.service.com';
    const apiToken = '6B3B0B9C1EE0';
    const client = new ExtensionManagerClient(apiToken, extensionManagerUri);
    const devName = 'johnny';

    it('prepares request for creating a new developer', () => {
      const settings = client.prepareCreateDeveloperRequest(devName);
      assert.deepEqual(settings, {
        json: true,
        method: 'POST',
        uri: `${extensionManagerUri}/v1/devs`,
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/vnd.api+json',
        },
        body: {
          data: {
            type: 'shoutem.core.developers',
            attributes: { name: devName },
          },
        },
      });
    });
  });

  describe('createDeveloper', () => {
    const extensionManagerUri = 'http://extensions.service.com';
    const apiToken = '6B3B0B9C1EE0';
    const client = new ExtensionManagerClient(apiToken, extensionManagerUri);
    const devName = 'johnny';

    it('returns an error on unspecified response', done => {
      nock(extensionManagerUri).post('/v1/devs').reply(678, {});

      client.createDeveloper(devName, (err, dev) => {
        try {
          assert(err instanceof ExtensionManagerError);
          assert.strictEqual(err.response.statusCode, 678);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns an error if response does not contain all info', done => {
      nock(extensionManagerUri).post('/v1/devs').reply(201, { data: 0 });

      client.createDeveloper(devName, (err, dev) => {
        try {
          assert(err instanceof ExtensionManagerError);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns an error if developer name is already taken', done => {
      nock(extensionManagerUri).post('/v1/devs').reply(409, {});

      client.createDeveloper(devName, (err, dev) => {
        try {
          assert(err instanceof DeveloperNameError);
          assert.include(err.message, devName);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('registers a new developer', done => {
      nock(extensionManagerUri).post('/v1/devs')
      .reply(201, {
        data: {
          id: 100,
          attributes: {
            name: 'johnny',
            userId: 200,
          },
        },
      });

      client.createDeveloper(devName, (err, dev) => {
        if (err) return done(err);
        try {
          assert.strictEqual(dev.name, 'johnny');
          assert.strictEqual(dev.id, 100);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });
});
