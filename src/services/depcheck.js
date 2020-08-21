import path from 'path';
import _ from 'lodash';
import depcheck from 'depcheck';

const promisedDepcheck = npmModuleRoot => new Promise((resolve, reject) => {
  depcheck(npmModuleRoot, {}, (result) => {
    if (_.some(result.invalidDirs)) {
      reject(new Error(`Directory ${_.keys(result.invalidDirs)[0]} is invalid`));
    }
    resolve(result);
  });
});

export async function getMissingDependencies(npmModuleRoot) {
  const { missing } = await promisedDepcheck(npmModuleRoot, {});
  return _.keys(missing).filter(dep => _.includes(dep, '.'));
}

export default async function (extensionRoot) {
  const appDependencies = await getMissingDependencies(path.join(extensionRoot, 'app'));
  if (appDependencies.length) {
    throw new Error(`${extensionRoot} app is missing some dependencies: ${appDependencies.join(',')}. Run with --nocheck to ignore`);
  }
  const serverDependencies = await getMissingDependencies(path.join(extensionRoot, 'server'));
  if (serverDependencies.length) {
    throw new Error(`${extensionRoot}/server is missing some dependencies: ${serverDependencies.join(',')}. Run with --nocheck to ignore`);
  }
}
