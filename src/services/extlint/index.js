import path from 'path';
import * as packageManager from '../package-manager-service';

export default async function(extPath) {
  const args = [
    path.join(extPath, '**/*.js'),
    path.join(extPath, '**/*.jsx'),
    '--no-eslintrc',
    '--no-error-on-unmatched-pattern',
    '--config',
    path.join(__dirname, 'extension-check-eslint-config.json'),
    '--ignore-pattern',
    'node_modules',
  ];

  return await packageManager.run(__dirname, 'extlint', args, ['--silent']);
}
