import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import mzfs from 'mz/fs';

export default class LocalDataClient {
  /*
    Collection of actions we need to do on user's file system.
  */
  constructor(rootDir = '') {
    this.dataDirPath = path.join(rootDir || os.homedir(), '.shoutem');
    this.tokenFilePath = path.join(this.dataDirPath, 'api-token');
    this.developerFilePath = path.join(this.dataDirPath, 'dev-info');
    this.serverEnvNamePath = path.join(this.dataDirPath, 'server-env');

    try {
      fs.mkdirSync(this.dataDirPath);
    } catch (exc) {
      if (exc.code !== 'EEXIST') throw (exc);
    }
  }

  getTokenFilePath() {
    return this.tokenFilePath;
  }

  getDeveloperFilePath() {
    return this.developerFilePath;
  }

  /*
    Fetches the API token from file system. `callback` will receive the token
    if user is logged in, and `null` otherwise.
  */
  loadApiToken() {
    // If file doesn't exist, that's ok - user just isn't logged in.
    // But if any other error pops up, we can't handle it here.
    return mzfs.readFile(this.tokenFilePath, 'utf8')
      .catch(err => (err.code === 'ENOENT' ? null : Promise.reject(err)));
  }

  /*
    Saves the API token to file system.
  */
  saveApiToken(token) {
    return mzfs.writeFile(this.tokenFilePath, token, 'utf8')
      .then(() => token);
  }

  /*
    Reads developer information from file system. `callback` will receive the
    info if it exists, and `null` otherwise.
  */
  loadDeveloper() {
    return mzfs
      .readFile(this.developerFilePath, 'utf8')
      .catch(err => (err.code === 'ENOENT' ? null : Promise.reject(err)))
      .then(JSON.parse);
  }

  /*
    Saves developer information to file system.
  */
  saveDeveloper(developer) {
    if (developer) {
      return mzfs
        .writeFile(this.developerFilePath, JSON.stringify(developer), 'utf8')
        .then(() => developer);
    }
    return mzfs.unlink(this.developerFilePath)
      .then(() => null)
      .catch(err => (err.code === 'ENOENT' ? null : Promise.reject(err)));
  }

  /*
    Clears all locally saved data.
  */
  clearAllData(callback) {
    rimraf(this.dataDirPath, callback);
  }
}
