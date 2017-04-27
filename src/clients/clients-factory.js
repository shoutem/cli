import { AppManagerClient } from './app-manager';
import { LegacyServiceClient } from './legacy-service';
import LocalDataClient from './local-data';

const localData = new LocalDataClient();

export class MissingApiTokenError {
  constructor(message) {
    this.message = message;
  }
}

async function loadApiToken() {
  const token = await localData.loadApiToken();
  if (token) {
    return token;
  }
  throw new MissingApiTokenError('Developer must be logged in to perform this action');
}

export async function getAppManager(appId) {
  return new AppManagerClient(await loadApiToken(), appId);
}

export async function getLegacyServiceClient() {
  return new LegacyServiceClient(await loadApiToken());
}

export function getLocalDataClient() {
  return localData;
}