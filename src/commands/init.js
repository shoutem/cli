/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import inquirer from 'inquirer';
import bluebird from 'bluebird';
import touch from 'touch';
import mzfs from 'mz/fs';
import { saveExtensionJsonAsync } from '../extension/data';

import { ensureDeveloperIsRegistered } from './register';
import { load } from '../extension/template';

import msg from '../user_messages';


export function cwd() {
  return process.cwd();
}

export async function promptExtensionInit(extName) {
  /* eslint no-confusing-arrow: 0 */
  /* eslint no-param-reassign: 0 */
  const name = _.kebabCase(extName);
  const title = _.upperFirst(extName.toLowerCase());
  const version = '0.0.1';

  const questions = [{
    name: 'title',
    message: 'Title',
    default: title,
  }, {
    name: 'version',
    message: 'Version',
    default: version,
    validate: value => value.match(/^(\d+)\.(\d+)\.(\d+)+$/)
                        ? true
                        : 'Version must contain numbers in format X.Y.Z',
  }, {
    name: 'description',
    message: 'Description',
  }];

  console.log(msg.init.requestInfo());

  const answer = await inquirer.prompt(questions);

  return {
    name,
    title: answer.title,
    version: answer.version,
    description: answer.description,
  };
}

export function savePackageJson(devName, extJson) {
  const appTemplate = load('init/app-package.json.template', { devName, extJson });
  const serverTemplate = load('init/server-package.json.template', { devName, extJson });

  return Promise.all([
    mzfs.writeFile(path.join(cwd(), 'app', 'package.json'),  appTemplate, 'utf8'),
    mzfs.writeFile(path.join(cwd(), 'server', 'package.json'),  serverTemplate, 'utf8'),
  ]).then(() => extJson);
}

export async function saveExtensionDataToFiles(devName, extName) {
  const extJson = await promptExtensionInit(extName);
  await saveExtensionJsonAsync(extJson);
  await savePackageJson(devName, extJson);
}

const dirs = [
  'app',
  'server',
];

const files = [
  ['extension.json'],
  ['app', 'index.js'],
  ['app', 'package.json'],
];

export function createScaffold() {
  const dirPaths = dirs.map(d => path.join(cwd(), d));
  const filePaths = files.map(f => path.join(cwd(), ...f));

  return bluebird.map(dirPaths, dir => mzfs.mkdir(dir))
    .then(() => bluebird.map(filePaths, path => touch(path)));
}

export async function createTemplateFiles() {
  const templates = [
    {
      string: load('./init/app-index.js.template'),
      path: ['app', 'index.js'],
    },
    {
      string: load('./init/app-const.js.template'),
      path: ['app', 'const.js'],
    },
  ];

  await Promise.all(templates.map(t => {
    const templatePath = path.join(cwd(), ...t.path);
    return mzfs.writeFile(templatePath, t.string, 'utf8');
  }));
}


async function ensureWorkingDirIsEmpty() {
  const files = await mzfs.readdir(cwd());

  if (files.length !== 0) {
    throw new Error(msg.init.nonEmpty());
  }
}

export async function initExtension(extName) {
  await ensureWorkingDirIsEmpty();
  const developer = await ensureDeveloperIsRegistered();
  await createScaffold();
  await saveExtensionDataToFiles(developer.name, extName);
  await createTemplateFiles();
}
