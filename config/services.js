const serverEnv = require(`../${process.env.SHOUTEM_CLI_DIRNAME}/clients/server-env`);

const envValues = {
  production: {
    host: 'api.shoutem.com',
    appBuilder: 'https://builder.shoutem.com',
    analyticsTrackingId: 'UA-807293-5',
  },
  dev: {
    host: 'api.dev.sauros.hr',
    appBuilder: 'https://builder.dev.sauros.hr',
  },
  qa: {
    host: 'api.qa.sauros.hr',
    appBuilder: 'https://builder.qa.sauros.hr',
  },
  local: {
    host: process.env.SHOUTEM_CLI_HOST || 'shoutem.local',
    appBuilder: process.env.SHOUTEM_CLI_APP_BUILDER || 'http://builder.shoutem.local:3000',
    appManager: process.env.SHOUTEM_CLI_APP_MANAGER || 'http://localhost:3003',
    authService: process.env.SHOUTEM_CLI_AUTH_SERVICE || 'http://localhost:3010',
    extensionManager: process.env.SHOUTEM_CLI_EXTENSION_MANAGER || 'http://localhost:3002',
    legacyService: process.env.SHOUTEM_CLI_LEGACY_SERVICE || 'http://v4.api.shoutem.local',
  },
};

const hostEnvName = serverEnv.getHostEnvName();
const env = envValues[hostEnvName];

module.exports = {
  appBuilder: env.appBuilder || `https://builder.${env.host}`,
  appManager: env.appManager || `https://apps.${env.host}`,
  authService: env.authService || `https://auth.${env.host}`,
  extensionManager: env.extensionManager || `https://extensions.${env.host}`,
  legacyService: env.legacyService || `https://v4.${env.host}`,
  cliAppUri: 'http://registry.npmjs.org/@shoutem%2fcli',
  mobileAppUrl: 'https://github.com/shoutem/platform',
  analyticsTrackingId: env.analyticsTrackingId || 'UA-807293-12',
};
