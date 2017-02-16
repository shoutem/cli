import fs from 'mz/fs';
import path from 'path';
import Mustache from 'mustache';
import { pathExists } from './data';
import mkdirp from 'mkdirp-promise';

const templatesDirectory = path.join(__dirname, '..', '..', '..', 'templates');

export function load(pathWithSlashes, templateContext) {
  const p = path.join(templatesDirectory, ...pathWithSlashes.split('/'));
  const template = fs.readFileSync(p, 'utf8');
  return Mustache.render(template, templateContext);
}

async function instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts) {
  if (localTemplatePath.endsWith('template-initialization.js')) {
    return null;
  }
  destinationPath = Mustache.render(destinationPath, context);

  const templatePath = path.join(templatesDirectory, localTemplatePath);
  const templatePathState = await fs.lstat(templatePath);
  if (templatePathState.isDirectory()) {
    await mkdirp(destinationPath);
    const files = await fs.readdir(templatePath);
    await Promise.all(files.map(file => {
      const src = path.join(localTemplatePath, file);
      const dest = path.join(destinationPath, file);
      return instantiateTemplatePathRec(src, dest, context, opts);
    }));
  } else if (templatePathState.isFile()) {
    if (!opts.overwrite(destinationPath) && await pathExists(destinationPath)) {
      throw new Error(`File ${destinationPath} already exists.`);
    }
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const fileContent = await Mustache.render(templateContent, context);
    await fs.writeFile(destinationPath, fileContent);
  }
}

export async function instantiateTemplatePath(localTemplatePath, destinationPath, context, opts = {}) {
  opts.overwrite = opts.overwrite || (() => false);

  await instantiateTemplatePathRec(localTemplatePath, destinationPath, context, opts);

  const templateInitializationPath = path.join(templatesDirectory, localTemplatePath, 'template-initialization.js');
  try {
    return await require(templateInitializationPath)(localTemplatePath, destinationPath, context);
  } catch (error) {
    throw error;
  }
}
