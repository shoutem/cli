import Promise from 'bluebird';
import fs from 'fs-extra';
import getOrSet from 'lodash-get-or-set';
import Mustache from 'mustache';
import path from 'path';

const templatesDirectory = path.join(__dirname, '../..', 'src/templates');

export function load(pathWithSlashes, templateContext) {
  const p = path.join(templatesDirectory, ...pathWithSlashes.split('/'));
  const template = fs.readFileSync(p, 'utf8');

  return Mustache.render(template, templateContext);
}

async function instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts) {
  if (localTemplatePath.endsWith('template-init.js')) {
    return null;
  }
  destinationPath = Mustache.render(destinationPath, context);

  const templatePath = path.join(templatesDirectory, localTemplatePath);
  const templatePathState = await fs.lstat(templatePath);
  getOrSet(context, 'diffLog', {});

  if (templatePathState.isDirectory()) {
    const files = await fs.readdir(templatePath);
    await Promise.map(files, file => {
      const src = path.join(localTemplatePath, file);
      const dest = path.join(destinationPath, file);

      return instantiateTemplatePathRec(src, dest, context, opts);
    });
  } else if (templatePathState.isFile()) {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    context.diffLog[destinationPath] = await Mustache.render(templateContent, context);
  }
}

function importName(modulePath, name, defaultValue) {
  try {
    return require(modulePath)[name] || defaultValue;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return defaultValue;
    }
    throw err;
  }
}

export async function instantiateTemplatePath(localTemplatePath, destinationPath, context, opts = {}) {
  opts.overwrite = opts.overwrite || (() => false);
  const postRunActions = getOrSet(context, 'postRunActions', []);

  const initPath = path.join(templatesDirectory, localTemplatePath, 'template-init');

  const before = importName(initPath, 'before', () => {});
  const after = importName(initPath, 'after', () => {});

  await before(context);
  await instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts);
  await after(context);

  return {
    diffLog: context.diffLog || {},
    postRunActions,
  };
}
