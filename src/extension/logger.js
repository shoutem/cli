import _ from 'underscore';

export function info(msg, object) {
  if (isVerbose()) {
    console.log(msg, object);
  }
}

export async function isVerbose() {
  return _.contains(process.argv, '--verbose');
}
