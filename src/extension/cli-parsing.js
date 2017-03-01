import _ from 'lodash';

export function limitArguments(args, maxAllowed) {
  if (args._.length > maxAllowed + 1) {
    throw new Error(`Invalid argument ${_.drop(args._, maxAllowed + 1)}`);
  }
}
