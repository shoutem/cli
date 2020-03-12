import path from 'path';
import * as npm from '../npm';

export default async function (extPath) {
  const args = [
    path.join(extPath, '**/*.js'),
    path.join(extPath, '**/*.jsx'),
    '--no-eslintrc',
    '--config', path.join(__dirname, 'extension-check-eslint-config.json'),
    '--ignore-pattern', 'node_modules'
  ];

  return await npm.run(__dirname, 'extlint', args, ['--silent']);
}
