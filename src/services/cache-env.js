import cache from './cache';
import { getHostEnvName } from '../clients/server-env';

function getValue(key) {
  return cache.getValue(`${getHostEnvName()}.${key}`);
}

function setValue(key, value, expirationSeconds) {
  return cache.setValue(`${getHostEnvName()}.${key}`, value, expirationSeconds);
}

export default {
  getValue,
  setValue,
};
