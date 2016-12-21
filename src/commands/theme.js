/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import async from 'async';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';

import { ensureDeveloperIsRegistered } from './register';
import {
  loadExtensionJson,
  saveExtensionJson,
  ensureInExtensionDir,
} from '../extension/data';
import { load } from '../extension/template';

import msg from '../user_messages';


export function promptThemeDetails(themeName, callback) {
  console.log('Enter theme information.');
  const questions = [{
    message: 'Title',
    name: 'title',
    default: themeName,
    type: 'input',
  }, {
    message: 'Description',
    name: 'description',
    type: 'input',
  }];

  inquirer.prompt(questions)
    .then(answers => callback(null, answers))
    .catch(callback);
}

export function exportThemeInIndexJs(themeName, callback) {
  const rootDir = ensureInExtensionDir();
  const indexJsPath = path.join(rootDir, 'app', 'index.js');

  async.waterfall([
    done => fs.readFile(indexJsPath, 'utf8', done),

    (indexJsContent, done) => {
      // Do not add anything to index.js if some theme is already exported.
      // Obviously, this is check if far from bullet-proof.
      if (indexJsContent.indexOf('export theme') !== -1) {
        return process.nextTick(done);
      }

      const template = load('./theme/app-index.js.template', { themeName });
      const newContent = `${indexJsContent}\n${template}\n`;
      return fs.writeFile(indexJsPath, newContent, 'utf8', done);
    },
  ],
    callback);
}

export function createThemeFile(themeName, callback) {
  const rootDir = ensureInExtensionDir();
  const themeDir = path.join(rootDir, 'app', 'themes');
  const themeFile = path.join(themeDir, `${themeName}.js`);

  async.waterfall([
    done => mkdirp(themeDir, done),

    (__, done) => {
      const template = load('./theme/app-themes-theme.js.template');
      fs.writeFile(themeFile, template, 'utf8', done);
    },
  ],
    err => callback(err, path.relative(rootDir, themeFile)));
}

export function createVariablesFile(themeName, callback) {
  const rootDir = ensureInExtensionDir();
  const themeVarsDir = path.join(rootDir, 'server', 'themes');
  const themeVarsFile = path.join(themeVarsDir, `${themeName}Variables.json`);

  async.waterfall([
    done => mkdirp(themeVarsDir, done),

    (__, done) => {
      const template = load('./theme/server-themes-variables.json.template', { themeName });
      fs.writeFile(themeVarsFile, template, 'utf8', done);
    },
  ],
    err => callback(err, path.relative(rootDir, themeVarsFile)));
}

export function createTheme(name, callback) {
  const themeName = _.upperFirst(_.camelCase(name));
  let extension;
  let themeFilePath;

  async.waterfall([
    // This will call process.exit() if called outside of extension directory:
    loadExtensionJson,

    (extJson, done) => {
      extension = extJson;
      ensureDeveloperIsRegistered()
        .then(dev => done(null, dev))
        .catch(err => done(err));
    },

    (__, done) => {
      const names = _.get(extension, 'themes', []).map(s => s.name);
      if (_.includes(names, themeName)) {
        done(new Error(msg.theme.add.alreadyExists(themeName)));
      } else {
        promptThemeDetails(themeName, done);
      }
    },

    (theme, done) => {
      /* eslint no-param-reassign: 0 */
      theme.name = themeName;
      theme.showcase = [];
      theme.variables = `@.${themeName}Variables`;

      // Add theme to array of themes.
      if (extension.themes) extension.themes.push(theme);
      else extension.themes = [theme];

      // Add theme variables.
      const vars = {
        name: `${themeName}Variables`,
        path: `./server/themes/${themeName}Variables.json`,
      };
      if (extension.themeVariables) extension.themeVariables.push(vars);
      else extension.themeVariables = [vars];

      saveExtensionJson(extension, done);
    },

    (extJson, done) => exportThemeInIndexJs(themeName, done),

    done => createThemeFile(themeName, done),

    (themeFile, done) => {
      themeFilePath = themeFile;
      createVariablesFile(themeName, done);
    },
  ],
    (err, themeVarsPath) => {
      if (err) callback(err);
      else callback(null, [themeFilePath, themeVarsPath]);
    });
}
