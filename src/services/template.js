import getOrSet from 'lodash-get-or-set';
import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import Mustache from 'mustache';

const templatesDirectory = path.join(__dirname, '..', 'templates');

export function load(pathWithSlashes, templateContext) {
  const p = path.join(templatesDirectory, ...pathWithSlashes.split('/'));
  const template = fs.readFileSync(p, 'utf8');

  return Mustache.render(template, templateContext);
}

async function instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts) {
  if (localTemplatePath.endsWith('template-init.js')) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  destinationPath = Mustache.render(destinationPath, context);

  const templatePath = path.join(templatesDirectory, localTemplatePath);
  const templatePathState = fs.lstatSync(templatePath);

  getOrSet(context, 'diffLog', {});

  if (templatePathState.isDirectory()) {
    const files = fs.readdirSync(templatePath);

    await Promise.map(files, (file) => {
      const src = path.join(localTemplatePath, file);
      const dest = path.join(destinationPath, file);
      return instantiateTemplatePathRec(src, dest, context, opts);
    });
  } else if (templatePathState.isFile()) {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    // eslint-disable-next-line no-param-reassign
    context.diffLog[destinationPath] = Mustache.render(templateContent, context);
  }
}

function importName(modulePath, name, defaultValue) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(modulePath)[name] || defaultValue;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return defaultValue;
    }
    throw err;
  }
}

export async function instantiateTemplatePath(localTemplatePath, destinationPath, context, opts = {}) {
  // eslint-disable-next-line no-param-reassign
  opts.overwrite = opts.overwrite || (() => false);

  const initPath = path.join(templatesDirectory, localTemplatePath, 'template-init');

  const postRunActions = getOrSet(context, 'postRunActions', []);
  const before = importName(initPath, 'before', () => {});
  const after = importName(initPath, 'after', () => {});

  before(context);
  await instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts);
  await after(context);

  return {
    diffLog: context.diffLog || {},
    postRunActions,
  };
}
