const os =  require('os');
const path = require('path');
const rimraf = require('rmfr');
const exec = require('child-process-promise').exec;
const getHomeDir = require('../home-dir');

const cliHome = getHomeDir();

const removeGlobalNpmLinks = [
  'npm remove -g shoutem.about',
  'npm remove -g shoutem.analytics',
  'npm remove -g shoutem.application',
  'npm remove -g shoutem.arno-theme',
  'npm remove -g shoutem.auth',
  'npm remove -g shoutem.books',
  'npm remove -g shoutem.cms',
  'npm remove -g shoutem.events',
  'npm remove -g shoutem.favorites',
  'npm remove -g shoutem.google-analytics',
  'npm remove -g shoutem.layouts',
  'npm remove -g shoutem.menu',
  'npm remove -g shoutem.navigation',
  'npm remove -g shoutem.news',
  'npm remove -g shoutem.page',
  'npm remove -g shoutem.people',
  'npm remove -g shoutem.persist',
  'npm remove -g shoutem.photos',
  'npm remove -g shoutem.places',
  'npm remove -g shoutem.platform-analytics',
  'npm remove -g shoutem.preview',
  'npm remove -g shoutem.products',
  'npm remove -g shoutem.rss-news',
  'npm remove -g shoutem.rss-photos',
  'npm remove -g shoutem.rss-videos',
  'npm remove -g shoutem.rss',
  'npm remove -g shoutem.rubicon-noir-theme',
  'npm remove -g shoutem.rubicon-rose-theme',
  'npm remove -g shoutem.rubicon-theme',
  'npm remove -g shoutem.shopify',
  'npm remove -g shoutem.sub-navigation',
  'npm remove -g shoutem.theme',
  'npm remove -g shoutem.video',
  'npm remove -g shoutem.vimeo',
  'npm remove -g shoutem.web-view',
  'npm remove -g shoutem.code-push',
  'npm remove -g shoutem.push-notifications',
  'npm remove -g shoutem.notification-center',
  'npm remove -g shoutem.firebase',
  'npm remove -g shoutem.youtube',
];

Promise.all([
  rimraf(path.join(cliHome, 'mobile-env')),
  rimraf(path.join(cliHome, 'mobile-app')),
  rimraf(path.join(cliHome, 'api-token')),
  rimraf(path.join(cliHome, 'dev-info')),
  rimraf(path.join(cliHome, 'last-error.json')),

  rimraf(path.join(cliHome, 'dev/app')),
  rimraf(path.join(cliHome, 'qa/app')),
  rimraf(path.join(cliHome, 'production/app')),
  rimraf(path.join(cliHome, 'beta/app')),
  rimraf(path.join(cliHome, 'local/app')),

  rimraf(path.join(cliHome, 'platforms')),
  rimraf(path.join(cliHome, '*/client/build-config.json'), { glob: true }),
  rimraf(path.join(cliHome, 'last-error.json')),
  rimraf(path.join(cliHome, 'production')),
  rimraf(path.join(cliHome, 'qa')),
  rimraf(path.join(cliHome, 'dev')),
  rimraf(path.join(cliHome, 'local'))
]).catch(console.error);

Promise.all(removeGlobalNpmLinks.map(unlink => exec(unlink))).catch(() => {});
