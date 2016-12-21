/* eslint no-underscore-dangle: 0 */
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import rimraf from 'rimraf';

import LocalDataClient, { __RewireAPI__ as localDataRewireApi } from '../local-data';


const tempDir = path.join(__dirname, 'temp');

function dirExists(dir) {
  try {
    const stat = fs.statSync(dir);
    return stat.isDirectory();
  } catch (exc) {
    return false;
  }
}

describe('LocalDataClient', () => {
  describe('constructor', () => {
    beforeEach(() => {
      if (dirExists(tempDir)) rimraf.sync(tempDir);
    });

    afterEach(() => {
      if (dirExists(tempDir)) rimraf.sync(tempDir);
    });

    it('throws if `rootDir` does not exist', () => {
      assert.throws(() => new LocalDataClient(tempDir));
    });

    it('initializes the client and creates the data dir', () => {
      fs.mkdirSync(tempDir);
      const client = new LocalDataClient(tempDir);
      const dataDir = path.join(tempDir, '.shoutem');

      assert(dirExists(dataDir));
      assert.strictEqual(client.tokenFilePath, path.join(dataDir, 'api-token'));
      assert.strictEqual(client.developerFilePath, path.join(dataDir, 'dev-info'));
    });

    it('initializes the client and does not throw if data dir already exists', () => {
      const dataDir = path.join(tempDir, '.shoutem');
      fs.mkdirSync(tempDir);
      fs.mkdirSync(dataDir);
      const client = new LocalDataClient(tempDir);

      assert(dirExists(dataDir));
      assert.strictEqual(client.tokenFilePath, path.join(dataDir, 'api-token'));
      assert.strictEqual(client.developerFilePath, path.join(dataDir, 'dev-info'));
    });
  });

  describe('loadApiToken', () => {
    beforeEach(() => fs.mkdirSync(tempDir));
    afterEach(() => rimraf.sync(tempDir));

    it('returns null if API token file does not exist', done => {
      const client = new LocalDataClient(tempDir);
      client.loadApiToken((err, token) => {
        if (err) return done(err);
        try {
          assert.isNull(token);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns content of the API token file', done => {
      const client = new LocalDataClient(tempDir);
      fs.writeFileSync(path.join(tempDir, '.shoutem', 'api-token'), 'hello', 'utf8');

      client.loadApiToken((err, token) => {
        if (err) return done(err);
        try {
          assert.strictEqual(token, 'hello');
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns any unexpected errors', done => {
      localDataRewireApi.__Rewire__('fs', {
        mkdirSync: () => null,
        readFile: (filePath, options, cb) => {
          const error = new Error('token read failed');
          error.code = 'WHATEVER';
          cb(error);
        },
      });
      const cleanUp = (err) => {
        localDataRewireApi.__ResetDependency__('fs');
        done(err);
      };
      const client = new LocalDataClient(tempDir);

      client.loadApiToken((err, token) => {
        try {
          assert.notOk(token);
          assert.strictEqual(err.message, 'token read failed');
          cleanUp();
        } catch (exc) {
          cleanUp(exc);
        }
      });
    });
  });

  describe('saveApiToken', () => {
    beforeEach(() => fs.mkdirSync(tempDir));
    afterEach(() => rimraf.sync(tempDir));

    it('saves the API token to file', done => {
      const client = new LocalDataClient(tempDir);

      client.saveApiToken('hello', (err, token) => {
        if (err) return done(err);
        try {
          const content = fs.readFileSync(path.join(tempDir, '.shoutem', 'api-token'), 'utf8');
          assert.strictEqual(token, 'hello');
          assert.strictEqual(content, 'hello');
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });

  describe('loadDeveloper', () => {
    beforeEach(() => fs.mkdirSync(tempDir));
    afterEach(() => rimraf.sync(tempDir));

    it('returns null if dev file does not exist', done => {
      const client = new LocalDataClient(tempDir);
      client.loadDeveloper((err, dev) => {
        if (err) return done(err);
        try {
          assert.isNull(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns parsed content of the developer info file', done => {
      const client = new LocalDataClient(tempDir);
      const devFilePath = path.join(tempDir, '.shoutem', 'dev-info');
      const developer = { id: 2222, name: 'joe' };
      fs.writeFileSync(devFilePath, JSON.stringify(developer), 'utf8');

      client.loadDeveloper((err, dev) => {
        if (err) return done(err);
        try {
          assert.deepEqual(dev, developer);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('catches and returns errors in JSON parsing', done => {
      const client = new LocalDataClient(tempDir);
      const devFilePath = path.join(tempDir, '.shoutem', 'dev-info');
      fs.writeFileSync(devFilePath, '{"yeah":"right"', 'utf8');

      client.loadDeveloper((err, dev) => {
        try {
          assert.ok(err);
          assert.isUndefined(dev);
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });

    it('returns any unexpected errors', done => {
      localDataRewireApi.__Rewire__('fs', {
        mkdirSync: () => null,
        readFile: (filePath, options, cb) => {
          const error = new Error('dev read failed');
          error.code = 'WHATEVER';
          cb(error);
        },
      });
      const cleanUp = (err) => {
        localDataRewireApi.__ResetDependency__('fs');
        done(err);
      };
      const client = new LocalDataClient(tempDir);

      client.loadDeveloper((err, dev) => {
        try {
          assert.notOk(dev);
          assert.strictEqual(err.message, 'dev read failed');
          cleanUp();
        } catch (exc) {
          cleanUp(exc);
        }
      });
    });
  });

  describe('saveDeveloper', () => {
    beforeEach(() => fs.mkdirSync(tempDir));
    afterEach(() => rimraf.sync(tempDir));

    it('saves developer information to file', done => {
      const client = new LocalDataClient(tempDir);
      const dev = { id: 1111, name: 'dave' };

      client.saveDeveloper(dev, (err, developer) => {
        if (err) return done(err);
        try {
          const content = fs.readFileSync(path.join(tempDir, '.shoutem', 'dev-info'), 'utf8');
          assert.deepEqual(dev, developer);
          assert.strictEqual(content, JSON.stringify(dev));
          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });
});
