import fs from 'fs';
import os from 'os';
import path from 'path';
import mzfs from 'mz/fs';
import { serverEnvPath } from './cli-paths';

export default class LocalDataClient {
  /*
    Collection of actions we need to do on user's file system.
  */
  constructor() {
    const dataDirPath = path.join(os.homedir(), '.shoutem');

    try {
      fs.mkdirSync(dataDirPath);
    } catch (exc) {
      if (exc.code !== 'EEXIST') throw (exc);
    }
  }

  async getTokenFilePath() {
    return path.join(await serverEnvPath(), 'api-token');
  }

  async getDeveloperFilePath() {
    return path.join(await serverEnvPath(), 'dev-info');
  }

  /*
    Fetches the API token from file system. `callback` will receive the token
    if user is logged in, and `null` otherwise.
  */
  async loadApiToken() {
    // If file doesn't exist, that's ok - user just isn't logged in.
    // But if any other error pops up, we can't handle it here.
    try {
      return await mzfs.readFile(await this.getTokenFilePath(), 'utf8')
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }

  /*
    Saves the API token to file system.
  */
  async saveApiToken(token) {
    await mzfs.writeFile(await this.getTokenFilePath(), token, 'utf8');
    return token;
  }

  async saveUserEmail(email) {
    await mzfs.writeFile(path.join(await serverEnvPath(), 'user-email'), email, 'utf8');
    return email;
  }

  async loadUserEmail() {
    try {
      return await mzfs.readFile(path.join(await serverEnvPath(), 'user-email'), 'utf8')
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
    }
  }

  /*
    Reads developer information from file system. `callback` will receive the
    info if it exists, and `null` otherwise.
  */
  async loadDeveloper() {
    let content = null;

    try {
      content = await mzfs.readFile(await this.getDeveloperFilePath(), 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }

    return JSON.parse(content);
  }

  /*
    Saves developer information to file system.
  */
  async saveDeveloper(developer) {
    if (developer) {
      await mzfs.writeFile(await this.getDeveloperFilePath(), JSON.stringify(developer), 'utf8');
      return developer;
    }
    try {
      await mzfs.unlink(await this.getDeveloperFilePath());
    } catch (err) {
    }
    return null;
  }
}

