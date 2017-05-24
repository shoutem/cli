import _ from 'lodash';

export function info(msg, object) {
  if (isVerbose()) {
    console.log(msg, object);
  }
}

export function isVerbose() {
  return _.includes(process.argv, '--verbose');
}
