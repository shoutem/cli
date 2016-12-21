/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import async from 'async';
import mkdirp from 'mkdirp';

import {
  loadExtensionJson,
  saveExtensionJson,
  ensureInExtensionDir,
} from '../extension/data';
import { load } from '../extension/template';

import msg from '../user_messages';


export function saveScreenToExtJson(screenName, callback) {
  async.waterfall([
    loadExtensionJson,

    (extension, done) => {
      /* eslint no-param-reassign: 0 */
      const names = _.get(extension, 'screens', []).map(s => s.name);
      if (_.includes(names, screenName)) {
        done(new Error(msg.screen.add.alreadyExists(screenName)));
      } else {
        done(null, extension);
      }
    },

    (extension, done) => {
      const screen = { name: screenName };
      if (extension.screens) extension.screens.push(screen);
      else extension.screens = [screen];
      saveExtensionJson(extension, done);
    },
  ],
    callback);
}

export function createScreen(screenName, callback) {
  const root = ensureInExtensionDir();
  let screenPath;

  async.series([
    done => saveScreenToExtJson(screenName, done),

    done => mkdirp(path.join(root, 'app', 'screens'), done),

    done => {
      const screenClassName = screenName[0].toUpperCase() + screenName.slice(1);
      const template = load('./screen/screen.js.template', { screenClassName });
      screenPath = path.join(root, 'app', 'screens', `${screenName}.js`);
      fs.writeFile(screenPath, template, 'utf8', done);
    },
  ],
    err => callback(err, screenPath ? path.relative(root, screenPath) : null));
}
