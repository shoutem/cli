import fs from 'fs';
import path from 'path';

import sinon from 'sinon';
import { assert } from 'chai';
import rimraf from 'rimraf';

import {
  initExtension,
  __Rewire__,
  __ResetDependency__,
} from '../init';


describe('Commands: init', () => {
  describe('initExtension', () => {
    const EXT_DIR = path.join(__dirname, 'test-extension');

    function getExtensionProps() {
      return {
        name: 'extension-name',
        version: '0.0.1',
        title: 'My extension',
        description: 'Very useful stuff',
      };
    }

    function fileExists(filePath) {
      return fs.statSync(path.join(EXT_DIR, filePath)).isFile();
    }

    function dirExists(dirPath) {
      return fs.statSync(path.join(EXT_DIR, dirPath)).isDirectory();
    }

    function readJsonFile(filePath) {
      return JSON.parse(fs.readFileSync(path.join(EXT_DIR, filePath), 'utf8'));
    }

    before(done => fs.mkdir(EXT_DIR, done));
    after(done => rimraf(EXT_DIR, done));

    beforeEach(() => {
      __Rewire__('cwd', sinon.stub().returns(EXT_DIR));
      __Rewire__('promptExtensionInit', sinon.stub().callsArgWith(1, null, getExtensionProps()));
      __Rewire__('ensureDeveloperIsRegistered', sinon.stub().callsArgWith(0, null, {
        name: 'joe',
        userId: '123456',
      }));
    });

    afterEach(() => {
      __ResetDependency__('cwd');
      __ResetDependency__('promptExtensionInit');
      __ResetDependency__('ensureDeveloperIsRegistered');
    });

    it('creates the extension scaffold', done => {
      initExtension('extension-name', err => {
        if (err) return done(err);

        try {
          assert(dirExists('app'));
          assert(dirExists('server'));
          assert(fileExists('extension.json'));
          assert(fileExists('app/index.js'));
          assert(fileExists('app/package.json'));

          const extProps = getExtensionProps();
          const extJson = readJsonFile('extension.json');
          assert.deepEqual(extJson, extProps);

          delete extProps.title;
          extProps.name = 'joe.extension-name';
          const packageJson = readJsonFile('app/package.json');
          assert.deepEqual(packageJson, extProps);

          return done();
        } catch (exc) {
          return done(exc);
        }
      });
    });
  });
});
