import * as cache from './cache';
import { getHostEnvName } from '../clients/server-env';

export function getValue(key) {
  return cache.getValue(`${getHostEnvName()}.${key}`)
}

export function setValue(key, value, expirationSeconds) {
  return cache.setValue(`${getHostEnvName()}.${key}`, value, expirationSeconds);
}
