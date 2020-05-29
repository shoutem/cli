'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pullExtensions = pullExtensions;
exports.clone = clone;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _tmpPromise = require('tmp-promise');

var _tmpPromise2 = _interopRequireDefault(_tmpPromise);

var _rmfr = require('rmfr');

var _rmfr2 = _interopRequireDefault(_rmfr);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _extensionManager = require('../clients/extension-manager');

var _appManager = require('../clients/app-manager');

var appManager = _interopRequireWildcard(_appManager);

var _packer = require('../services/packer');

var _legacyService = require('../clients/legacy-service');

var _fsExtra = require('fs-extra');

var _appSelector = require('../services/app-selector');

var _appSelector2 = _interopRequireDefault(_appSelector);

var _platform = require('../services/platform');

var _login = require('./login');

var _progressBar = require('../services/progress-bar');

var _spinner = require('../services/spinner');

var _commandExists = require('../services/command-exists');

var _commandExists2 = _interopRequireDefault(_commandExists);

var _slugify = require('slugify');

var _slugify2 = _interopRequireDefault(_slugify);

require('colors');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const downloadFile = _bluebird2.default.promisify(require('download-file'));

async function pullExtensions(appId, destinationDir) {
  const installations = await appManager.getInstallations(appId);
  const n = installations.length;
  let i = 0;
  for (const inst of installations) {
    i++;
    await (0, _spinner.spinify)(pullExtension(destinationDir, inst), `Downloading extension ${i}/${n}: ${inst.canonicalName}`);
  }
}

async function pullExtension(destinationDir, { extension, canonicalName }) {
  try {
    const url = await getExtensionUrl(extension);
    const tgzDir = (await _tmpPromise2.default.dir()).path;
    await downloadFile(url, { directory: tgzDir, filename: 'extension.tgz' });
    await (0, _packer.shoutemUnpack)(_path2.default.join(tgzDir, 'extension.tgz'), _path2.default.join(destinationDir, canonicalName));
  } catch (err) {
    err.message = `Could not fetch extension ${canonicalName}`;
    throw err;
  }
}

async function getExtensionUrl(extId) {
  const resp = await (0, _extensionManager.getExtension)(extId);
  const { location: { extension } } = resp;

  return `${removeTrailingSlash(extension.package)}/extension.tgz`;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, "");
}

function ensurePlatformCompatibility(platform) {
  const msg = `Your app is using Shoutem Platform ${platform.version}` + `, but cloning is supported only on Shoutem Platform 1.1.2 or later.\n` + `Please, update the Platform through Settings -> Shoutem Platform -> Install page on the Builder or install older (and unsupported) version of ` + `the Shoutem CLI by running 'npm install -g @shoutem/cli@0.0.152'`;

  if (_semver2.default.lte(platform.version, '1.1.1')) {
    throw new Error(msg);
  }
}

async function queryPathExistsAction(destinationDir, oldDirectoryName) {
  const { action } = await _inquirer2.default.prompt({
    type: 'list',
    name: 'action',
    message: `Directory ${oldDirectoryName} already exists`,
    choices: [{
      name: 'Overwrite',
      value: 'overwrite'
    }, {
      name: 'Abort',
      value: 'abort'
    }, {
      name: 'Different app directory name',
      value: 'rename'
    }]
  });

  if (action === 'overwrite') {
    return { type: 'overwrite' };
  } else if (action === 'abort') {
    return { type: 'abort' };
  }

  const { newDirectoryName } = await _inquirer2.default.prompt({
    type: 'input',
    name: 'newDirectoryName',
    message: 'New directory name',
    async validate(dirName) {
      if (dirName.indexOf(' ') > -1) {
        return 'No spaces are allowed';
      }
      if (await (0, _fsExtra.pathExists)(_path2.default.join(destinationDir, dirName))) {
        return `Directory ${dirName} already exists.`;
      }
      return true;
    }
  });

  return {
    type: 'rename',
    newDirectoryName,
    newAppDir: _path2.default.join(destinationDir, newDirectoryName)
  };
}

async function clone(opts, destinationDir) {
  if (!(await (0, _commandExists2.default)('git'))) {
    throw new Error('Missing `git` command');
  }
  await (0, _login.ensureUserIsLoggedIn)();

  opts.appId = opts.appId || (await (0, _appSelector2.default)());

  const { name } = await (0, _legacyService.getApp)(opts.appId);

  let directoryName = (0, _slugify2.default)(opts.dir || name, { remove: /[$*_+~.()'"!\-:@]/g });
  console.log('cloning to', directoryName);
  let appDir = _path2.default.join(destinationDir, directoryName);

  if (opts.force) {
    await (0, _spinner.spinify)((0, _rmfr2.default)(appDir), `Destroying directory ${directoryName}`);
  }

  if (await (0, _fsExtra.pathExists)(appDir)) {
    const action = await queryPathExistsAction(destinationDir, directoryName);
    if (action.type === 'overwrite') {
      await (0, _spinner.spinify)((0, _rmfr2.default)(appDir), `Destroying directory ${directoryName}`);
    } else if (action.type === 'abort') {
      console.log('Clone aborted.'.bold.yellow);
      return;
    } else {
      directoryName = action.newDirectoryName;
      appDir = action.newAppDir;
    }
  }

  if (appDir.indexOf(' ') >= 0) {
    throw new Error("Path to the directory you are cloning to can't contain spaces.");
  }

  await (0, _mkdirpPromise2.default)(appDir);

  console.log(`Cloning \`${name}\` to \`${directoryName}\`...`);

  if (opts.platform) {
    await (0, _spinner.spinify)((0, _fsExtra.copy)(opts.platform, appDir), 'Copying platform code');
  } else {
    const platform = await appManager.getApplicationPlatform(opts.appId);
    ensurePlatformCompatibility(platform);
    await (0, _platform.downloadApp)(opts.appId, appDir, {
      progress: (0, _progressBar.createProgressHandler)({ msg: 'Downloading shoutem platform' }),
      useCache: !opts.force,

      versionCheck: mobileAppVersion => {
        if (!_semver2.default.gte(mobileAppVersion, '0.58.9')) {
          throw new Error('This version of CLI only supports platforms containing mobile app 0.58.9 or higher');
        }
      }
    });
  }

  await pullExtensions(opts.appId, _path2.default.join(appDir, 'extensions'));

  await (0, _platform.fixPlatform)(appDir, opts.appId);

  const config = await (0, _platform.createPlatformConfig)(appDir, {
    appId: opts.appId
  });
  await (0, _platform.setPlatformConfig)(appDir, config);

  if (opts.noconfigure) {
    console.log('Skipping configure step due to --noconfigure flag');
  } else {
    await (0, _platform.configurePlatform)(appDir, config);
  }

  console.log('Done.\n'.green.bold);
  console.log('To run your app on iOS:'.bold);
  console.log(`    cd ${appDir}`);
  console.log('    react-native run-ios');

  console.log('To run your app on Android:'.bold);
  console.log(`    cd ${appDir}`);
  console.log('    Have an Android simulator running or a device connected');
  console.log('    react-native run-android');

  if (!/^win/.test(process.platform) && !(await (0, _commandExists2.default)('watchman'))) {
    console.log('HINT: You should probably install Facebook\'s `watchman` before running react-native commands'.bold.yellow);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbG9uZS5qcyJdLCJuYW1lcyI6WyJwdWxsRXh0ZW5zaW9ucyIsImNsb25lIiwiYXBwTWFuYWdlciIsImRvd25sb2FkRmlsZSIsIlByb21pc2UiLCJwcm9taXNpZnkiLCJyZXF1aXJlIiwiYXBwSWQiLCJkZXN0aW5hdGlvbkRpciIsImluc3RhbGxhdGlvbnMiLCJnZXRJbnN0YWxsYXRpb25zIiwibiIsImxlbmd0aCIsImkiLCJpbnN0IiwicHVsbEV4dGVuc2lvbiIsImNhbm9uaWNhbE5hbWUiLCJleHRlbnNpb24iLCJ1cmwiLCJnZXRFeHRlbnNpb25VcmwiLCJ0Z3pEaXIiLCJ0bXAiLCJkaXIiLCJwYXRoIiwiZGlyZWN0b3J5IiwiZmlsZW5hbWUiLCJqb2luIiwiZXJyIiwibWVzc2FnZSIsImV4dElkIiwicmVzcCIsImxvY2F0aW9uIiwicmVtb3ZlVHJhaWxpbmdTbGFzaCIsInBhY2thZ2UiLCJzdHIiLCJyZXBsYWNlIiwiZW5zdXJlUGxhdGZvcm1Db21wYXRpYmlsaXR5IiwicGxhdGZvcm0iLCJtc2ciLCJ2ZXJzaW9uIiwic2VtdmVyIiwibHRlIiwiRXJyb3IiLCJxdWVyeVBhdGhFeGlzdHNBY3Rpb24iLCJvbGREaXJlY3RvcnlOYW1lIiwiYWN0aW9uIiwiaW5xdWlyZXIiLCJwcm9tcHQiLCJ0eXBlIiwibmFtZSIsImNob2ljZXMiLCJ2YWx1ZSIsIm5ld0RpcmVjdG9yeU5hbWUiLCJ2YWxpZGF0ZSIsImRpck5hbWUiLCJpbmRleE9mIiwibmV3QXBwRGlyIiwib3B0cyIsImRpcmVjdG9yeU5hbWUiLCJyZW1vdmUiLCJjb25zb2xlIiwibG9nIiwiYXBwRGlyIiwiZm9yY2UiLCJib2xkIiwieWVsbG93IiwiZ2V0QXBwbGljYXRpb25QbGF0Zm9ybSIsInByb2dyZXNzIiwidXNlQ2FjaGUiLCJ2ZXJzaW9uQ2hlY2siLCJtb2JpbGVBcHBWZXJzaW9uIiwiZ3RlIiwiY29uZmlnIiwibm9jb25maWd1cmUiLCJncmVlbiIsInRlc3Qi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RURaLFVBQVFDLEdBQVIsQ0FBWSxVQUFVYSxLQUFWLENBQWdCVixJQUE1QjtBQUNBSixVQUFRQyxHQUFSLENBQVksMEJBQTBCRyxJQUF0QztBQUNBSixVQUFRQyxHQUFSLENBQWEsVUFBU0MsTUFBTyxFQUE3QjtBQUNBRixVQUFRQyxHQUFSLENBQVksMEJBQVo7O0FBRUFELFVBQVFDLEdBQVIsQ0FBWSw4QkFBOEJHLElBQTFDO0FBQ0FKLFVBQVFDLEdBQVIsQ0FBYSxVQUFTQyxNQUFPLEVBQTdCO0FBQ0FGLFVBQVFDLEdBQVIsQ0FBWSw2REFBWjtBQUNBRCxVQUFRQyxHQUFSLENBQVksOEJBQVo7O0FBRUEsTUFBSSxDQUFDLE9BQU9jLElBQVAsQ0FBWUMsUUFBUXZDLFFBQXBCLENBQUQsSUFBa0MsRUFBQyxNQUFNLDZCQUFjLFVBQWQsQ0FBUCxDQUF0QyxFQUF3RTtBQUN0RXVCLFlBQVFDLEdBQVIsQ0FBWSxnR0FBZ0dHLElBQWhHLENBQXFHQyxNQUFqSDtBQUNEO0FBQ0YiLCJmaWxlIjoiY2xvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwLXByb21pc2UnO1xyXG5pbXBvcnQgdG1wIGZyb20gJ3RtcC1wcm9taXNlJztcclxuaW1wb3J0IHJtcmYgZnJvbSAncm1mcic7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcic7XHJcbmltcG9ydCBpbnF1aXJlciBmcm9tICdpbnF1aXJlcic7XHJcbmltcG9ydCB7IGdldEV4dGVuc2lvbiB9IGZyb20gJy4uL2NsaWVudHMvZXh0ZW5zaW9uLW1hbmFnZXInO1xyXG5pbXBvcnQgKiBhcyBhcHBNYW5hZ2VyIGZyb20gJy4uL2NsaWVudHMvYXBwLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBzaG91dGVtVW5wYWNrIH0gZnJvbSAnLi4vc2VydmljZXMvcGFja2VyJztcclxuaW1wb3J0IHsgZ2V0QXBwIH0gZnJvbSAnLi4vY2xpZW50cy9sZWdhY3ktc2VydmljZSc7XHJcbmltcG9ydCB7IHBhdGhFeGlzdHMsIGNvcHkgfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCBzZWxlY3RBcHAgZnJvbSAnLi4vc2VydmljZXMvYXBwLXNlbGVjdG9yJztcclxuaW1wb3J0IHtcclxuICBkb3dubG9hZEFwcCwgZml4UGxhdGZvcm0sIGNvbmZpZ3VyZVBsYXRmb3JtLCBjcmVhdGVQbGF0Zm9ybUNvbmZpZyxcclxuICBzZXRQbGF0Zm9ybUNvbmZpZ1xyXG59IGZyb20gJy4uL3NlcnZpY2VzL3BsYXRmb3JtJztcclxuaW1wb3J0IHsgZW5zdXJlVXNlcklzTG9nZ2VkSW4gfSBmcm9tICcuL2xvZ2luJztcclxuaW1wb3J0IHsgY3JlYXRlUHJvZ3Jlc3NIYW5kbGVyIH0gZnJvbSAnLi4vc2VydmljZXMvcHJvZ3Jlc3MtYmFyJztcclxuaW1wb3J0IHsgc3BpbmlmeSB9IGZyb20gJy4uL3NlcnZpY2VzL3NwaW5uZXInO1xyXG5pbXBvcnQgY29tbWFuZEV4aXN0cyBmcm9tICcuLi9zZXJ2aWNlcy9jb21tYW5kLWV4aXN0cyc7XHJcbmltcG9ydCBzbHVnaWZ5IGZyb20gJ3NsdWdpZnknO1xyXG5pbXBvcnQgJ2NvbG9ycyc7XHJcblxyXG5jb25zdCBkb3dubG9hZEZpbGUgPSBQcm9taXNlLnByb21pc2lmeShyZXF1aXJlKCdkb3dubG9hZC1maWxlJykpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1bGxFeHRlbnNpb25zKGFwcElkLCBkZXN0aW5hdGlvbkRpcikge1xyXG4gIGNvbnN0IGluc3RhbGxhdGlvbnMgPSBhd2FpdCBhcHBNYW5hZ2VyLmdldEluc3RhbGxhdGlvbnMoYXBwSWQpO1xyXG4gIGNvbnN0IG4gPSBpbnN0YWxsYXRpb25zLmxlbmd0aDtcclxuICBsZXQgaSA9IDA7XHJcbiAgZm9yKGNvbnN0IGluc3Qgb2YgaW5zdGFsbGF0aW9ucykge1xyXG4gICAgaSsrO1xyXG4gICAgYXdhaXQgc3BpbmlmeShwdWxsRXh0ZW5zaW9uKGRlc3RpbmF0aW9uRGlyLCBpbnN0KSwgYERvd25sb2FkaW5nIGV4dGVuc2lvbiAke2l9LyR7bn06ICR7aW5zdC5jYW5vbmljYWxOYW1lfWApO1xyXG4gIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHVsbEV4dGVuc2lvbihkZXN0aW5hdGlvbkRpciwgeyBleHRlbnNpb24sIGNhbm9uaWNhbE5hbWUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1cmwgPSBhd2FpdCBnZXRFeHRlbnNpb25VcmwoZXh0ZW5zaW9uKTtcclxuICAgIGNvbnN0IHRnekRpciA9IChhd2FpdCB0bXAuZGlyKCkpLnBhdGg7XHJcbiAgICBhd2FpdCBkb3dubG9hZEZpbGUodXJsLCB7IGRpcmVjdG9yeTogdGd6RGlyLCBmaWxlbmFtZTogJ2V4dGVuc2lvbi50Z3onIH0pO1xyXG4gICAgYXdhaXQgc2hvdXRlbVVucGFjayhwYXRoLmpvaW4odGd6RGlyLCAnZXh0ZW5zaW9uLnRneicpLCBwYXRoLmpvaW4oZGVzdGluYXRpb25EaXIsIGNhbm9uaWNhbE5hbWUpKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGVyci5tZXNzYWdlID0gYENvdWxkIG5vdCBmZXRjaCBleHRlbnNpb24gJHtjYW5vbmljYWxOYW1lfWA7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRFeHRlbnNpb25VcmwoZXh0SWQpIHtcclxuICBjb25zdCByZXNwID0gYXdhaXQgZ2V0RXh0ZW5zaW9uKGV4dElkKTtcclxuICBjb25zdCB7IGxvY2F0aW9uOiB7IGV4dGVuc2lvbiB9IH0gPSByZXNwO1xyXG5cclxuIHJldHVybiBgJHtyZW1vdmVUcmFpbGluZ1NsYXNoKGV4dGVuc2lvbi5wYWNrYWdlKX0vZXh0ZW5zaW9uLnRnemA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRyYWlsaW5nU2xhc2goc3RyKSB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgXCJcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuc3VyZVBsYXRmb3JtQ29tcGF0aWJpbGl0eShwbGF0Zm9ybSkge1xyXG4gIGNvbnN0IG1zZyA9IGBZb3VyIGFwcCBpcyB1c2luZyBTaG91dGVtIFBsYXRmb3JtICR7cGxhdGZvcm0udmVyc2lvbn1gK1xyXG4gICAgYCwgYnV0IGNsb25pbmcgaXMgc3VwcG9ydGVkIG9ubHkgb24gU2hvdXRlbSBQbGF0Zm9ybSAxLjEuMiBvciBsYXRlci5cXG5gK1xyXG4gICAgYFBsZWFzZSwgdXBkYXRlIHRoZSBQbGF0Zm9ybSB0aHJvdWdoIFNldHRpbmdzIC0+IFNob3V0ZW0gUGxhdGZvcm0gLT4gSW5zdGFsbCBwYWdlIG9uIHRoZSBCdWlsZGVyIG9yIGluc3RhbGwgb2xkZXIgKGFuZCB1bnN1cHBvcnRlZCkgdmVyc2lvbiBvZiBgICtcclxuICAgIGB0aGUgU2hvdXRlbSBDTEkgYnkgcnVubmluZyAnbnBtIGluc3RhbGwgLWcgQHNob3V0ZW0vY2xpQDAuMC4xNTInYDtcclxuXHJcbiAgaWYgKHNlbXZlci5sdGUocGxhdGZvcm0udmVyc2lvbiwgJzEuMS4xJykpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG4gIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcXVlcnlQYXRoRXhpc3RzQWN0aW9uKGRlc3RpbmF0aW9uRGlyLCBvbGREaXJlY3RvcnlOYW1lKSB7XHJcbiAgY29uc3QgeyBhY3Rpb24gfSA9IGF3YWl0IGlucXVpcmVyLnByb21wdCh7XHJcbiAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICBuYW1lOiAnYWN0aW9uJyxcclxuICAgIG1lc3NhZ2U6IGBEaXJlY3RvcnkgJHtvbGREaXJlY3RvcnlOYW1lfSBhbHJlYWR5IGV4aXN0c2AsXHJcbiAgICBjaG9pY2VzOiBbe1xyXG4gICAgICBuYW1lOiAnT3ZlcndyaXRlJyxcclxuICAgICAgdmFsdWU6ICdvdmVyd3JpdGUnXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdBYm9ydCcsXHJcbiAgICAgIHZhbHVlOiAnYWJvcnQnLFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnRGlmZmVyZW50IGFwcCBkaXJlY3RvcnkgbmFtZScsXHJcbiAgICAgIHZhbHVlOiAncmVuYW1lJ1xyXG4gICAgfV1cclxuICB9KTtcclxuXHJcbiAgaWYgKGFjdGlvbiA9PT0gJ292ZXJ3cml0ZScpIHtcclxuICAgIHJldHVybiB7IHR5cGU6ICdvdmVyd3JpdGUnIH07XHJcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdhYm9ydCcpIHtcclxuICAgIHJldHVybiB7IHR5cGU6ICdhYm9ydCcgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHsgbmV3RGlyZWN0b3J5TmFtZSB9ID0gYXdhaXQgaW5xdWlyZXIucHJvbXB0KHtcclxuICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICBuYW1lOiAnbmV3RGlyZWN0b3J5TmFtZScsXHJcbiAgICBtZXNzYWdlOiAnTmV3IGRpcmVjdG9yeSBuYW1lJyxcclxuICAgIGFzeW5jIHZhbGlkYXRlKGRpck5hbWUpIHtcclxuICAgICAgaWYgKGRpck5hbWUuaW5kZXhPZignICcpID4gLTEpIHtcclxuICAgICAgICByZXR1cm4gJ05vIHNwYWNlcyBhcmUgYWxsb3dlZCc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGF3YWl0IHBhdGhFeGlzdHMocGF0aC5qb2luKGRlc3RpbmF0aW9uRGlyLCBkaXJOYW1lKSkpIHtcclxuICAgICAgICByZXR1cm4gYERpcmVjdG9yeSAke2Rpck5hbWV9IGFscmVhZHkgZXhpc3RzLmBcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6ICdyZW5hbWUnLFxyXG4gICAgbmV3RGlyZWN0b3J5TmFtZSxcclxuICAgIG5ld0FwcERpcjogcGF0aC5qb2luKGRlc3RpbmF0aW9uRGlyLCBuZXdEaXJlY3RvcnlOYW1lKVxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbG9uZShvcHRzLCBkZXN0aW5hdGlvbkRpcikge1xyXG4gIGlmICghYXdhaXQgY29tbWFuZEV4aXN0cygnZ2l0JykpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBgZ2l0YCBjb21tYW5kJyk7XHJcbiAgfVxyXG4gIGF3YWl0IGVuc3VyZVVzZXJJc0xvZ2dlZEluKCk7XHJcblxyXG4gIG9wdHMuYXBwSWQgPSBvcHRzLmFwcElkIHx8IGF3YWl0IHNlbGVjdEFwcCgpO1xyXG5cclxuICBjb25zdCB7IG5hbWUgfSA9IGF3YWl0IGdldEFwcChvcHRzLmFwcElkKTtcclxuXHJcbiAgbGV0IGRpcmVjdG9yeU5hbWUgPSBzbHVnaWZ5KG9wdHMuZGlyIHx8IG5hbWUsIHsgcmVtb3ZlOiAvWyQqXyt+LigpJ1wiIVxcLTpAXS9nIH0pO1xyXG4gIGNvbnNvbGUubG9nKCdjbG9uaW5nIHRvJywgZGlyZWN0b3J5TmFtZSk7XHJcbiAgbGV0IGFwcERpciA9IHBhdGguam9pbihkZXN0aW5hdGlvbkRpciwgZGlyZWN0b3J5TmFtZSk7XHJcblxyXG4gIGlmIChvcHRzLmZvcmNlKSB7XHJcbiAgICBhd2FpdCBzcGluaWZ5KHJtcmYoYXBwRGlyKSwgYERlc3Ryb3lpbmcgZGlyZWN0b3J5ICR7ZGlyZWN0b3J5TmFtZX1gKTtcclxuICB9XHJcblxyXG4gIGlmIChhd2FpdCBwYXRoRXhpc3RzKGFwcERpcikpIHtcclxuICAgIGNvbnN0IGFjdGlvbiA9IGF3YWl0IHF1ZXJ5UGF0aEV4aXN0c0FjdGlvbihkZXN0aW5hdGlvbkRpciwgZGlyZWN0b3J5TmFtZSk7XHJcbiAgICBpZiAoYWN0aW9uLnR5cGUgPT09ICdvdmVyd3JpdGUnKSB7XHJcbiAgICAgIGF3YWl0IHNwaW5pZnkocm1yZihhcHBEaXIpLCBgRGVzdHJveWluZyBkaXJlY3RvcnkgJHtkaXJlY3RvcnlOYW1lfWApO1xyXG4gICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ2Fib3J0Jykge1xyXG4gICAgICBjb25zb2xlLmxvZygnQ2xvbmUgYWJvcnRlZC4nLmJvbGQueWVsbG93KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlyZWN0b3J5TmFtZSA9IGFjdGlvbi5uZXdEaXJlY3RvcnlOYW1lO1xyXG4gICAgICBhcHBEaXIgPSBhY3Rpb24ubmV3QXBwRGlyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGFwcERpci5pbmRleE9mKCcgJykgPj0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGF0aCB0byB0aGUgZGlyZWN0b3J5IHlvdSBhcmUgY2xvbmluZyB0byBjYW4ndCBjb250YWluIHNwYWNlcy5cIik7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBta2RpcnAoYXBwRGlyKTtcclxuXHJcbiAgY29uc29sZS5sb2coYENsb25pbmcgXFxgJHtuYW1lfVxcYCB0byBcXGAke2RpcmVjdG9yeU5hbWV9XFxgLi4uYCk7XHJcblxyXG4gIGlmIChvcHRzLnBsYXRmb3JtKSB7XHJcbiAgICBhd2FpdCBzcGluaWZ5KGNvcHkob3B0cy5wbGF0Zm9ybSwgYXBwRGlyKSwgJ0NvcHlpbmcgcGxhdGZvcm0gY29kZScpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBwbGF0Zm9ybSA9IGF3YWl0IGFwcE1hbmFnZXIuZ2V0QXBwbGljYXRpb25QbGF0Zm9ybShvcHRzLmFwcElkKTtcclxuICAgIGVuc3VyZVBsYXRmb3JtQ29tcGF0aWJpbGl0eShwbGF0Zm9ybSk7XHJcbiAgICBhd2FpdCBkb3dubG9hZEFwcChvcHRzLmFwcElkLCBhcHBEaXIsIHtcclxuICAgICAgcHJvZ3Jlc3M6IGNyZWF0ZVByb2dyZXNzSGFuZGxlcih7IG1zZzogJ0Rvd25sb2FkaW5nIHNob3V0ZW0gcGxhdGZvcm0nIH0pLFxyXG4gICAgICB1c2VDYWNoZTogIW9wdHMuZm9yY2UsXHJcblxyXG4gICAgICB2ZXJzaW9uQ2hlY2s6IG1vYmlsZUFwcFZlcnNpb24gPT4ge1xyXG4gICAgICAgIGlmICghc2VtdmVyLmd0ZShtb2JpbGVBcHBWZXJzaW9uLCAnMC41OC45JykpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyB2ZXJzaW9uIG9mIENMSSBvbmx5IHN1cHBvcnRzIHBsYXRmb3JtcyBjb250YWluaW5nIG1vYmlsZSBhcHAgMC41OC45IG9yIGhpZ2hlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBwdWxsRXh0ZW5zaW9ucyhvcHRzLmFwcElkLCBwYXRoLmpvaW4oYXBwRGlyLCAnZXh0ZW5zaW9ucycpKTtcclxuXHJcbiAgYXdhaXQgZml4UGxhdGZvcm0oYXBwRGlyLCBvcHRzLmFwcElkKTtcclxuXHJcbiAgY29uc3QgY29uZmlnID0gYXdhaXQgY3JlYXRlUGxhdGZvcm1Db25maWcoYXBwRGlyLCB7XHJcbiAgICBhcHBJZDogb3B0cy5hcHBJZFxyXG4gIH0pO1xyXG4gIGF3YWl0IHNldFBsYXRmb3JtQ29uZmlnKGFwcERpciwgY29uZmlnKTtcclxuXHJcbiAgaWYgKG9wdHMubm9jb25maWd1cmUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdTa2lwcGluZyBjb25maWd1cmUgc3RlcCBkdWUgdG8gLS1ub2NvbmZpZ3VyZSBmbGFnJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGF3YWl0IGNvbmZpZ3VyZVBsYXRmb3JtKGFwcERpciwgY29uZmlnKTtcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKCdEb25lLlxcbicuZ3JlZW4uYm9sZCk7XHJcbiAgY29uc29sZS5sb2coJ1RvIHJ1biB5b3VyIGFwcCBvbiBpT1M6Jy5ib2xkKTtcclxuICBjb25zb2xlLmxvZyhgICAgIGNkICR7YXBwRGlyfWApO1xyXG4gIGNvbnNvbGUubG9nKCcgICAgcmVhY3QtbmF0aXZlIHJ1bi1pb3MnKTtcclxuXHJcbiAgY29uc29sZS5sb2coJ1RvIHJ1biB5b3VyIGFwcCBvbiBBbmRyb2lkOicuYm9sZCk7XHJcbiAgY29uc29sZS5sb2coYCAgICBjZCAke2FwcERpcn1gKTtcclxuICBjb25zb2xlLmxvZygnICAgIEhhdmUgYW4gQW5kcm9pZCBzaW11bGF0b3IgcnVubmluZyBvciBhIGRldmljZSBjb25uZWN0ZWQnKTtcclxuICBjb25zb2xlLmxvZygnICAgIHJlYWN0LW5hdGl2ZSBydW4tYW5kcm9pZCcpO1xyXG5cclxuICBpZiAoIS9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pICYmICFhd2FpdCBjb21tYW5kRXhpc3RzKCd3YXRjaG1hbicpKSB7XHJcbiAgICBjb25zb2xlLmxvZygnSElOVDogWW91IHNob3VsZCBwcm9iYWJseSBpbnN0YWxsIEZhY2Vib29rXFwncyBgd2F0Y2htYW5gIGJlZm9yZSBydW5uaW5nIHJlYWN0LW5hdGl2ZSBjb21tYW5kcycuYm9sZC55ZWxsb3cpO1xyXG4gIH1cclxufVxyXG4iXX0=