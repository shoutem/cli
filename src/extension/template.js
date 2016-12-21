import fs from 'mz/fs';
import path from 'path';
import Mustache from 'mustache';
import { pathExists } from './data';

export function load(pathWithSlashes, templateContext) {
  const p = path.join(__dirname, '..', '..', 'templates', ...pathWithSlashes.split('/'));
  const template = fs.readFileSync(p, 'utf8');
  return Mustache.render(template, templateContext);
}

export async function createTemplateIfNotExists(templatePath, templateContext, destinationPath) {
  if (await pathExists(destinationPath)) {
    throw new Error(`File ${destinationPath} already exists.`);
  }

  const template = load(templatePath, templateContext);
  await fs.writeFile(destinationPath, template);

  return template;
}
