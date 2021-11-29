import _ from 'lodash';

export function validateArgumentCount(args, maxAllowed) {
  if (args._.length > maxAllowed + 1) {
    throw new Error(`Invalid argument ${_.drop(args._, maxAllowed + 1)}`);
  }
}

const varNameRegex = /^[a-zA-Z]\w*$/;

export function isVariableName(str) {
  return varNameRegex.test(str);
}

export function ensureVariableName(str) {
  if (!varNameRegex.test(str)) {
    throw new Error(`${str} is not a valid name`);
  }
}
