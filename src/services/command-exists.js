import Promise from 'bluebird';
export default Promise.promisify(require('command-exists'));
