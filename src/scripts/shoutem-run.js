require('babel-register')(require('../../package.json').babel);
require('fetch-everywhere');
const readline = require('readline');

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
