import _ from 'lodash';

export function isVerbose() {
  return _.includes(process.argv, '--verbose');
}

export function info(msg, object) {
  if (isVerbose()) {
    console.log(msg, object);
  }
}
