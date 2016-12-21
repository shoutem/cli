/* eslint no-console: 0 */
const request = require('request-promise-native');
const fs = require('mz/fs');
const exec = require('mz/child_process').exec;

const config = require('./.update-theme');

const theme = request(config.themeUrl)
  .then(response => fs.writeFile(config.themeFile, response))
  .then(() => console.log('Themes file OK'));

const vars = request(config.varsUrl)
  .then(response => fs.writeFile(config.varsFile, response))
  .then(() => console.log('Theme variables file OK'));

Promise.all([theme, vars])
  .then(() => fs.readFile('package.json', 'utf8'))
  .then(JSON.parse)
  .then(packageObj => {
    const version = packageObj.version.split('.');
    const versionNum = parseInt(version[version.length - 1], 10) + 1;
    version[version.length - 1] = versionNum.toString();

    /* eslint no-param-reassign: "off" */
    packageObj.version = version.join('.');

    return packageObj;
  })
  .then(obj => `${JSON.stringify(obj, null, 2)}\n`)
  .then(str => fs.writeFile('package.json', str))
  .then(() => console.log('npm package version updated'))
  .then(() => exec('npm run build'))
  .then(([output]) => console.log(output))
  .then(() => exec(`git add ${config.themeFile}`))
  .then(() => exec(`git add ${config.varsFile}`))
  .then(() => exec('git add package.json'))
  .then(() => exec('git commit -m "Theme updated"'))
  .then(() => console.log('All done, you can npm publish && git push now'))
  .catch(console.error);
