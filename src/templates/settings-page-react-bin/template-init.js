/* eslint prettier/prettier: 0 */
const _ = require('lodash');
const path = require('path');
const { getOrSet } = require('../../services/helpers');
const { stringify } = require('../../services/data');
const {
  getPackageJson,
  install,
  packageManager,
} = require('../../services/package-manager-service');

const pkgJsonTemplate = {
  "scripts": {
    "lint": "eslint --no-eslintrc src/**/*.{js,jsx}",
    "clean": "rimraf ./build/*",
    "build": "npm run clean && cross-env NODE_ENV=production webpack --config ./bin/webpack/webpack.config.js",
    "dev": "webpack-dev-server --config ./bin/webpack/webpack.config.js"
  },
  "devDependencies": {
    "@babel/core": "^7.8.4",
    "@babel/plugin-proposal-class-properties": "^7.8.3",
    "@babel/plugin-transform-modules-commonjs": "^7.8.3",
    "@babel/plugin-transform-runtime": "^7.8.3",
    "@babel/preset-env": "^7.8.4",
    "@babel/preset-react": "^7.8.3",
    "@shoutem/eslint-config-react": "^1.0.5",
    "babel-eslint": "^10.1.0",
    "babel-loader": "^8.0.6",
    "cross-env": "^4.0.0",
    "css-loader": "^3.4.2",
    "cssnano": "^4.1.10",
    "eslint": "^6.8.0",
    "eslint-loader": "^3.0.3",
    "eslint-plugin-babel": "^5.3.0",
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-jsx-a11y": "^6.4.0",
    "eslint-plugin-prettier": "3.1.3",
    "eslint-plugin-react": "^7.21.5",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "file-loader": "^6.0.0",
    "html-webpack-plugin": "^4.0.3",
    "mini-css-extract-plugin": "0.9.0",
    "optimize-css-assets-webpack-plugin": "5.0.3",
    "terser-webpack-plugin": "2.3.5",
    "path": "^0.12.7",
    "postcss-loader": "^3.0.0",
    "prettier": "1.19.1",
    "rimraf": "^3.0.2",
    "sass": "1.54.1",
    "sass-loader": "10.2.0",
    "style-loader": "^1.1.3",
    "url-loader": "^3.0.0",
    "webpack": "^4.41.6",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "@shoutem/extension-sandbox": "^0.1.4",
    "@shoutem/react-web-ui": "0.12.4",
    "@shoutem/redux-api-sdk": "^2.0.0",
    "@shoutem/redux-io": "^3.2.1",
    "@shoutem/redux-sync-state-engine": "^0.0.2",
    "auto-bind": "^4.0.0",
    "es6-promise": "^4.1.1",
    "fetch-everywhere": "^1.0.5",
    "lodash": "^4.17.4",
    "prop-types": "^15.7.2",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "i18next": "^19.7.0",
    "react-i18next": "^11.7.3",
    "react-redux": "^5.0.3",
    "redux": "^3.6.0",
    "redux-thunk": "~2.2.0",
    "urijs": "^1.18.9"
  },
  "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    "plugins": [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-modules-commonjs"
    ]
  }
};

 async function before(context) {
  const { extensionPath } = context;
  const serverPath = path.join(extensionPath, 'server');
  context.serverJsonString = stringify(_.merge(await getPackageJson(serverPath), pkgJsonTemplate));
}

 async function after(context) {
  const { extensionPath } = context;

  getOrSet(context, 'postRunActions', [])
    .push(async () => {
      console.log(`Running ${packageManager} install on the server dir...`);
      await install(path.join(extensionPath, 'server'));
      console.log(`${packageManager} install... [${'OK'.green.bold}]`)
    });
}

module.exports = {
  before,
  after,
};
