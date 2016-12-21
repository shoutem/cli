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


export function saveSchemaToExtJson(schemaName, callback) {
  async.waterfall([
    loadExtensionJson,

    (extension, done) => {
      /* eslint no-param-reassign: 0 */
      const names = _.get(extension, 'dataSchemas', []).map(s => s.name);
      if (_.includes(names, schemaName)) {
        done(new Error(msg.schema.add.alreadyExists(schemaName)));
      } else {
        done(null, extension);
      }
    },

    (extension, done) => {
      const schema = {
        name: schemaName,
        // extension.json should specify all paths with forward slashes regardless of OS:
        path: `server/data-schemas/${schemaName}.json`,
      };
      if (extension.dataSchemas) extension.dataSchemas.push(schema);
      else extension.dataSchemas = [schema];
      saveExtensionJson(extension, done);
    },
  ],
    callback);
}

export function createSchema(schemaName, callback) {
  const root = ensureInExtensionDir();
  let schemaPath;

  async.series([
    done => saveSchemaToExtJson(schemaName, done),

    done => mkdirp(path.join(root, 'server', 'data-schemas'), done),

    done => {
      const template = load('./schema/schema.json.template', { schemaName });
      schemaPath = path.join(root, 'server', 'data-schemas', `${schemaName}.json`);
      fs.writeFile(schemaPath, template, 'utf8', done);
    },
  ],
    err => callback(err, schemaPath ? path.relative(root, schemaPath) : null));
}
