import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import { getHostEnvName } from './server-env';

export async function localStoragePath() {
  const storagePath = path.join(os.homedir(), '.shoutem');
  await mkdirp(storagePath);
  return storagePath;
}

export async function lastErrorPath() {
  return path.join(await localStoragePath(), 'last-error.json');
}

export async function mobileEnvPath() {
  const hostEnvName = getHostEnvName();
  const envPath = path.join(await localStoragePath(), 'mobile-env', hostEnvName);
  await mkdirp(envPath);
  return envPath;
}

export async function mobileAppPath() {
  return path.join(await mobileEnvPath(), 'package');
}

export async function mobileAppConfigPath() {
  return path.join(await mobileAppPath(), 'config.json');
}

export async function mobileAppConfigTemplatePath() {
  return path.join(await mobileAppPath(), 'config.template.json');
}

export async function mobileAppPackageJson() {
  return path.join(await mobileAppPath(), 'package.json');
}
