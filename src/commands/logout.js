/* eslint no-console: 0 */
import LocalDataClient from '../clients/local-data';
import fs from 'mz/fs';

export function logout() {
  const client = new LocalDataClient();

  const deletePromise = [
    client.getTokenFilePath(),
    client.getDeveloperFilePath()
  ]
  .map(file => fs.unlink(file))
  .map(unlinkPromise => unlinkPromise.catch(err => err.code === 'ENOENT'
    ? Promise.resolve()
    : Promise.reject(err))
  );

  return Promise.all(deletePromise);
}
