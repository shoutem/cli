import _ from 'lodash';

export function isVerbose() {
  return _.includes(process.argv, '--verbose');
}

function info(msg, object) {
  if (isVerbose()) {
    console.log(msg, object);
  }
}

export default {
  info,
  isVerbose,
};
