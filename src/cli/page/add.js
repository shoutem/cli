import pascalize from 'uppercamelcase';
import decamelize from 'decamelize';
import msg from '../../user_messages';
import { ensureVariableName } from '../../services/cli-parsing';
import { executeAndHandleError } from '../../services/error-handler';
import * as yarn from '../../services/yarn';
import { ensureInExtensionDir } from '../../services/extension';
import { instantiateTemplatePath } from '../../services/template';

export const description = 'Add page to current extension';
export const command = 'add <name>';
export const builder = {
  type: {
    alias: 't',
    requiresArg: true,
    description: 'Type of settings page to create (react, html, blank). React is default.',
    default: 'react'
  },
  scope: {
    alias: 's',
    description: 'Where should the page be inserted (shortcut, extension).',
    requiresArg: true,
  },
  shortcut: {
    description: 'Name of the shortcut if settings page is to be connected with shortcut',
    requiresArg: true,
  },
  title: {
    description: 'Title of the settings page being created. Defaults to page name',
    requiresArg: true,
  }
};
export const handler = args => executeAndHandleError(() => createPage(args));

export async function createPage({ name: pageName, type, shortcut: shortcutName, scope, title }, extensionDir = ensureInExtensionDir()) {
  ensureVariableName(pageName);
  await yarn.ensureYarnInstalled();

  const pageDirectoryName = decamelize(pageName, '-');
  const pageClassName = pascalize(pageName);
  title = title || decamelize(pageName, ' ');

  if (shortcutName && !scope) {
    scope = 'shortcut';
  }

  const templateVars = {
    pageDirectoryName,
    pageClassName,
    pageName: pageClassName,
    pageTitle: title,
    scope,
    shortcutName
  };

  if (type === 'html') {
    const { path } = await instantiateTemplatePath('html-settings-page', extensionDir, templateVars);
    console.log(msg.page.add.complete({ path, pageName }));
  }

  if (type === 'react') {
    await instantiateTemplatePath('react-settings-page', extensionDir, templateVars);
    await instantiateTemplatePath('react-settings-bin', extensionDir, {}, { overwrite: () => true });
    console.log(`React settings page added to pages/${pageDirectoryName}`);
  }

  if (type === 'blank') {
    console.log('Added empty page');
  }
}
