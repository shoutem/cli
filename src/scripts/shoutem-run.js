require('fetch-everywhere');
const readline = require('readline');
const semver = require('semver');

require('babel-register')({
  presets: [semver.lt(process.versions.node, '7.0.0') ? 'node6' : 'node7'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  ignore: false,
  only: ['config', 'src', 'templates']
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function waitForEnter() {
  console.log('\nPress ENTER to end this process');
  rl.on('line', () => {
    rl.close();
  });
}

const mobilizerRun = require('../commands/run').default;
const options = require('../cli/run').builder(require('yargs')).argv;

mobilizerRun(options)
  .then(() => {
    waitForEnter();
  })
  .catch(err => {
    console.log(err);
    waitForEnter();
  });
