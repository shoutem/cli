import { getHostEnvName } from '../src/clients/server-env';

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
    host: process.env.SHOUTEM_CLI_HOST || 'dev.sauros.hr',
    appBuilder: process.env.SHOUTEM_CLI_APP_BUILDER,
    appManager: process.env.SHOUTEM_CLI_APP_MANAGER,
    authService: process.env.SHOUTEM_CLI_AUTH_SERVICE,
    extensionManager: process.env.SHOUTEM_CLI_EXTENSION_MANAGER,
    legacyService: process.env.SHOUTEM_CLI_LEGACY_SERVICE,
  }
};

const env = envValues[getHostEnvName()];

export default {
  appBuilder: env.appBuilder || `https://builder.${env.host}`,
  appManager: env.appManager || `http://apps.${env.host}`,
  authService: env.authService || `http://api.${env.host}`,
  extensionManager: env.extensionManager || `http://extensions.${env.host}`,
  legacyService: env.legacyService || `http://api.${env.host}`,
  cliAppUri: 'http://registry.npmjs.org/@shoutem%2fcli',
  mobileAppUrl: 'https://github.com/5minutes/mobile-app'
};
