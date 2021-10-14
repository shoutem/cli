export function isValidExtensionName(name) {
  // eslint-disable-next-line no-useless-escape
  return /^[a-z]+[a-z0-9\-]*$/.test(name);
}

export function isAscii(str) {
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(str);
}

export function containsSpace(str) {
  return str.indexOf(' ') > -1;
}
