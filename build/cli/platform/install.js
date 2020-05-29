'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.command = exports.description = undefined;
exports.installPlatform = installPlatform;

require('colors');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _spinner = require('../../services/spinner');

var _appSelector = require('../../services/app-selector');

var _appSelector2 = _interopRequireDefault(_appSelector);

var _login = require('../../commands/login');

var _platformSelector = require('../../services/platform-selector');

var _platformSelector2 = _interopRequireDefault(_platformSelector);

var _errorHandler = require('../../services/error-handler');

var _appManager = require('../../clients/app-manager');

var _platform = require('../../services/platform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Install a platform on an application';
const command = exports.command = 'install';
const builder = exports.builder = yargs => yargs.options({
  app: {
    description: 'Id of the application to install the new platform to',
    type: 'number',
    requiresArg: true,
    alias: 'a'
  },
  platform: {
    description: 'Id of platform to install',
    type: 'string',
    requiresArg: true,
    alias: 'p'
  }
}).usage(`shoutem ${command} [options]\n\n${description}`);

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(() => installPlatform(args));

async function installPlatform({ app, platform }) {
  const developer = await (0, _login.ensureUserIsLoggedIn)();

  let appConfig;
  if (await (0, _platform.getPlatformRootDir)(process.cwd(), { shouldThrow: false })) {
    appConfig = await (0, _platform.getPlatformConfig)();
  }

  // if app ID is not explicitly passed, then try to get the ID from current directory, otherwise ask the user
  const appId = app || _lodash2.default.get(appConfig, 'appId') || (await (0, _appSelector2.default)());

  const platformId = platform || (await (0, _platformSelector2.default)());

  await (0, _spinner.spinify)((0, _appManager.installApplicationPlatform)(appId, platformId));
  console.log('Your platform is now installed on your app');
  console.log('Success!'.green.bold);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvcGxhdGZvcm0vaW5zdGFsbC5qcyJdLCJuYW1lcyI6WyJpbnN0YWxsUGxhdGZvcm0iLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwiYXBwIiwidHlwZSIsInJlcXVpcmVzQXJnIiwiYWxpYXMiLCJwbGF0Zm9ybSIsInVzYWdlIiwiaGFuZGxlciIsImFyZ3MiLCJkZXZlbG9wZXIiLCJhcHBDb25maWciLCJwcm9jZXNzIiwiY3dkIiwic2hvdWxkVGhyb3ciLCJhcHBJZCIsIl8iLCJnZXQiLCJwbGF0Zm9ybUlkIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwiYm9sZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBK0JzQkEsZSxHQUFBQSxlOztBQS9CdEI7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxNQUFNQyxvQ0FBYyxzQ0FBcEI7QUFDQSxNQUFNQyw0QkFBVSxTQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTQSxNQUM3QkMsT0FENkIsQ0FDckI7QUFDUEMsT0FBSztBQUNITCxpQkFBYSxzREFEVjtBQUVITSxVQUFNLFFBRkg7QUFHSEMsaUJBQWEsSUFIVjtBQUlIQyxXQUFPO0FBSkosR0FERTtBQU9QQyxZQUFVO0FBQ1JULGlCQUFhLDJCQURMO0FBRVJNLFVBQU0sUUFGRTtBQUdSQyxpQkFBYSxJQUhMO0FBSVJDLFdBQU87QUFKQztBQVBILENBRHFCLEVBZTdCRSxLQWY2QixDQWV0QixXQUFVVCxPQUFRLGlCQUFnQkQsV0FBWSxFQWZ4QixDQUF6Qjs7QUFpQkEsTUFBTVcsNEJBQVVDLFFBQVEseUNBQXNCLE1BQU1iLGdCQUFnQmEsSUFBaEIsQ0FBNUIsQ0FBeEI7O0FBRUEsZUFBZWIsZUFBZixDQUErQixFQUFFTSxHQUFGLEVBQU9JLFFBQVAsRUFBL0IsRUFBa0Q7QUFDdkQsUUFBTUksWUFBWSxNQUFNLGtDQUF4Qjs7QUFFQSxNQUFJQyxTQUFKO0FBQ0EsTUFBSSxNQUFNLGtDQUFtQkMsUUFBUUMsR0FBUixFQUFuQixFQUFrQyxFQUFFQyxhQUFhLEtBQWYsRUFBbEMsQ0FBVixFQUFxRTtBQUNuRUgsZ0JBQVksTUFBTSxrQ0FBbEI7QUFDRDs7QUFFRDtBQUNBLFFBQU1JLFFBQVFiLE9BQU9jLGlCQUFFQyxHQUFGLENBQU1OLFNBQU4sRUFBaUIsT0FBakIsQ0FBUCxLQUFvQyxNQUFNLDRCQUExQyxDQUFkOztBQUVBLFFBQU1PLGFBQWFaLGFBQVksTUFBTSxpQ0FBbEIsQ0FBbkI7O0FBRUEsUUFBTSxzQkFBUSw0Q0FBMkJTLEtBQTNCLEVBQWtDRyxVQUFsQyxDQUFSLENBQU47QUFDQUMsVUFBUUMsR0FBUixDQUFZLDRDQUFaO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxXQUFXQyxLQUFYLENBQWlCQyxJQUE3QjtBQUNEIiwiZmlsZSI6Imluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2NvbG9ycyc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IHNwaW5pZnkgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zcGlubmVyJztcclxuaW1wb3J0IHNlbGVjdEFwcCBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hcHAtc2VsZWN0b3InO1xyXG5pbXBvcnQgeyBlbnN1cmVVc2VySXNMb2dnZWRJbiB9IGZyb20gJy4uLy4uL2NvbW1hbmRzL2xvZ2luJztcclxuaW1wb3J0IHNlbGVjdFBsYXRmb3JtIGZyb20gJy4uLy4uL3NlcnZpY2VzL3BsYXRmb3JtLXNlbGVjdG9yJztcclxuaW1wb3J0IHsgZXhlY3V0ZUFuZEhhbmRsZUVycm9yIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcbmltcG9ydCB7IGluc3RhbGxBcHBsaWNhdGlvblBsYXRmb3JtIH0gZnJvbSAnLi4vLi4vY2xpZW50cy9hcHAtbWFuYWdlcic7XHJcbmltcG9ydCB7IGdldFBsYXRmb3JtQ29uZmlnLCBnZXRQbGF0Zm9ybVJvb3REaXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wbGF0Zm9ybSc7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5zdGFsbCBhIHBsYXRmb3JtIG9uIGFuIGFwcGxpY2F0aW9uJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAnaW5zdGFsbCc7XHJcbmV4cG9ydCBjb25zdCBidWlsZGVyID0geWFyZ3MgPT4geWFyZ3NcclxuICAub3B0aW9ucyh7XHJcbiAgICBhcHA6IHtcclxuICAgICAgZGVzY3JpcHRpb246ICdJZCBvZiB0aGUgYXBwbGljYXRpb24gdG8gaW5zdGFsbCB0aGUgbmV3IHBsYXRmb3JtIHRvJyxcclxuICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxyXG4gICAgICBhbGlhczogJ2EnLFxyXG4gICAgfSxcclxuICAgIHBsYXRmb3JtOiB7XHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWQgb2YgcGxhdGZvcm0gdG8gaW5zdGFsbCcsXHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcclxuICAgICAgYWxpYXM6ICdwJyxcclxuICAgIH0sXHJcbiAgfSlcclxuICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhcmdzID0+IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcigoKSA9PiBpbnN0YWxsUGxhdGZvcm0oYXJncykpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQbGF0Zm9ybSh7IGFwcCwgcGxhdGZvcm0gfSkge1xyXG4gIGNvbnN0IGRldmVsb3BlciA9IGF3YWl0IGVuc3VyZVVzZXJJc0xvZ2dlZEluKCk7XHJcblxyXG4gIGxldCBhcHBDb25maWc7XHJcbiAgaWYgKGF3YWl0IGdldFBsYXRmb3JtUm9vdERpcihwcm9jZXNzLmN3ZCgpLCB7IHNob3VsZFRocm93OiBmYWxzZSB9KSkge1xyXG4gICAgYXBwQ29uZmlnID0gYXdhaXQgZ2V0UGxhdGZvcm1Db25maWcoKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIGFwcCBJRCBpcyBub3QgZXhwbGljaXRseSBwYXNzZWQsIHRoZW4gdHJ5IHRvIGdldCB0aGUgSUQgZnJvbSBjdXJyZW50IGRpcmVjdG9yeSwgb3RoZXJ3aXNlIGFzayB0aGUgdXNlclxyXG4gIGNvbnN0IGFwcElkID0gYXBwIHx8IF8uZ2V0KGFwcENvbmZpZywgJ2FwcElkJykgfHwgYXdhaXQgc2VsZWN0QXBwKCk7XHJcblxyXG4gIGNvbnN0IHBsYXRmb3JtSWQgPSBwbGF0Zm9ybSB8fCBhd2FpdCBzZWxlY3RQbGF0Zm9ybSgpO1xyXG5cclxuICBhd2FpdCBzcGluaWZ5KGluc3RhbGxBcHBsaWNhdGlvblBsYXRmb3JtKGFwcElkLCBwbGF0Zm9ybUlkKSk7XHJcbiAgY29uc29sZS5sb2coJ1lvdXIgcGxhdGZvcm0gaXMgbm93IGluc3RhbGxlZCBvbiB5b3VyIGFwcCcpO1xyXG4gIGNvbnNvbGUubG9nKCdTdWNjZXNzIScuZ3JlZW4uYm9sZCk7XHJcbn1cclxuIl19