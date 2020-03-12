const os = require('os');
const path = require('path');

module.exports = () => process.env.SHOUTEM_CLI_HOME || path.join(os.homedir(), '.shoutem');
