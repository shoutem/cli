const os = require('os');
const path = require('path');

module.exports = () => path.join(process.env.SHOUTEM_CLI_HOME || os.homedir(), '.shoutem');
