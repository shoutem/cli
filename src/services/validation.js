// disabling eslint for regular expressions
/* eslint-disable */

export function isValidExtensionName(name) {
  return /^[a-z]+[a-z0-9\-]*$/.test(name);
}

export function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

export function containsSpace(str) {
  return str.indexOf(' ') > -1;
}

export function isValidPlatformUrl(url) {
  // TODO: Implement platform URL validator
  return false;
}

export function validatePlatformArchive(archive) {
  // TODO: Implement platform archive validator
  return false;
}
