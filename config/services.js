const { getHostEnvName } = require('../src/clients/server-env');

const envValues = {
  production: {
    host: 'beta.shoutem.com'
  },
  beta: {
    host: 'beta.aperfector.com'
  },
  dev: {
    host: 'dev.sauros.hr'
  },
  qa: {
    host: 'qa.sauros.hr'
  },
  local: {
    host: process.env.SHOUTEM_CLI_HOST || 'shoutem.local',
    appBuilder: process.env.SHOUTEM_CLI_APP_BUILDER || 'http://builder.shoutem.local:3000',
    appManager: process.env.SHOUTEM_CLI_APP_MANAGER || 'http://localhost:3003',
    authService: process.env.SHOUTEM_CLI_AUTH_SERVICE || 'http://api.shoutem.local',
    extensionManager: process.env.SHOUTEM_CLI_EXTENSION_MANAGER || 'http://localhost:3002',
    legacyService: process.env.SHOUTEM_CLI_LEGACY_SERVICE || 'http://api.shoutem.local',
  }
};

const env = envValues[getHostEnvName()];

module.exports = {
  appBuilder: env.appBuilder || `https://builder.${env.host}`,
  appManager: env.appManager || `https://apps.${env.host}`,
  authService: env.authService || `https://api.${env.host}`,
  extensionManager: env.extensionManager || `https://extensions.${env.host}`,
  legacyService: env.legacyService || `https://api.${env.host}`,
  cliAppUri: 'http://registry.npmjs.org/@shoutem%2fcli'
};
