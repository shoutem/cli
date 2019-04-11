import path from 'path';
import npm from '../npm';

export default function (extPath) {
  const args = [
    path.join(extPath, '**/*.js'),
    path.join(extPath, '**/*.jsx'),
    '--no-eslintrc',
    '--config', path.join(__dirname, 'extension-check-eslint-config.json'),
    '--ignore-pattern', 'node_modules'
  ];

  return npm.run(__dirname, 'extlint', args, ['--silent']);
}
