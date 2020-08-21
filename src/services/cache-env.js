import * as cache from './cache';
import { getHostEnvName } from '../clients/server-env';

export async function getValue(key) {
  return cache.getValue(`${getHostEnvName()}.${key}`);
}

export async function setValue(key, value, expirationSeconds) {
  return cache.setValue(`${getHostEnvName()}.${key}`, value, expirationSeconds);
}
