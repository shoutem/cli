'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.handler = handler;

var _errorHandler = require('../services/error-handler');

var _platform = require('../services/platform');

const description = exports.description = 'Runs platform\'s configure script to sync with native changes to local extensions';
const command = exports.command = 'configure';
const builder = exports.builder = yargs => {
  return yargs.options({
    release: {
      alias: 'r',
      description: '(re)configure the app with last published configuration from the shoutem server',
      type: 'boolean',
      default: false
    },
    production: {
      alias: 'p',
      description: 'configure the app for production mode build',
      type: 'boolean',
      default: false
    }
  }).usage(`shoutem ${command} \n\n${description}`);
};
async function handler(args) {
  await (0, _errorHandler.executeAndHandleError)(async () => {
    const appDir = await (0, _platform.getPlatformRootDir)();

    await (0, _platform.setPlatformConfig)(appDir, _extends({}, (await (0, _platform.getPlatformConfig)(appDir)), {
      release: !!args.release,
      production: !!args.production
    }));

    await (0, _platform.configurePlatform)(appDir);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlndXJlLmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwicmVsZWFzZSIsImFsaWFzIiwidHlwZSIsImRlZmF1bHQiLCJwcm9kdWN0aW9uIiwidXNhZ2UiLCJhcmdzIiwiYXBwRGlyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUF1QnNCQSxPLEdBQUFBLE87O0FBdkJ0Qjs7QUFDQTs7QUFFTyxNQUFNQyxvQ0FBYyxtRkFBcEI7QUFDQSxNQUFNQyw0QkFBVSxXQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxhQUFTO0FBQ1BDLGFBQU8sR0FEQTtBQUVQTixtQkFBYSxpRkFGTjtBQUdQTyxZQUFNLFNBSEM7QUFJUEMsZUFBUztBQUpGLEtBREY7QUFPUEMsZ0JBQVk7QUFDVkgsYUFBTyxHQURHO0FBRVZOLG1CQUFhLDZDQUZIO0FBR1ZPLFlBQU0sU0FISTtBQUlWQyxlQUFTO0FBSkM7QUFQTCxHQURKLEVBZUpFLEtBZkksQ0FlRyxXQUFVVCxPQUFRLFFBQU9ELFdBQVksRUFmeEMsQ0FBUDtBQWdCRCxDQWpCTTtBQWtCQSxlQUFlRCxPQUFmLENBQXVCWSxJQUF2QixFQUE2QjtBQUNsQyxRQUFNLHlDQUFzQixZQUFZO0FBQ3RDLFVBQU1DLFNBQVMsTUFBTSxtQ0FBckI7O0FBRUEsVUFBTSxpQ0FBa0JBLE1BQWxCLGdCQUNELE1BQU0saUNBQWtCQSxNQUFsQixDQURMO0FBRUpQLGVBQVMsQ0FBQyxDQUFDTSxLQUFLTixPQUZaO0FBR0pJLGtCQUFZLENBQUMsQ0FBQ0UsS0FBS0Y7QUFIZixPQUFOOztBQU1BLFVBQU0saUNBQWtCRyxNQUFsQixDQUFOO0FBQ0QsR0FWSyxDQUFOO0FBV0QiLCJmaWxlIjoiY29uZmlndXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY3V0ZUFuZEhhbmRsZUVycm9yIH0gZnJvbSAnLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcbmltcG9ydCB7Y29uZmlndXJlUGxhdGZvcm0sIGdldFBsYXRmb3JtQ29uZmlnLCBnZXRQbGF0Zm9ybVJvb3REaXIsIHNldFBsYXRmb3JtQ29uZmlnfSBmcm9tICcuLi9zZXJ2aWNlcy9wbGF0Zm9ybSc7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnUnVucyBwbGF0Zm9ybVxcJ3MgY29uZmlndXJlIHNjcmlwdCB0byBzeW5jIHdpdGggbmF0aXZlIGNoYW5nZXMgdG8gbG9jYWwgZXh0ZW5zaW9ucyc7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2NvbmZpZ3VyZSc7XHJcbmV4cG9ydCBjb25zdCBidWlsZGVyID0geWFyZ3MgPT4ge1xyXG4gIHJldHVybiB5YXJnc1xyXG4gICAgLm9wdGlvbnMoe1xyXG4gICAgICByZWxlYXNlOiB7XHJcbiAgICAgICAgYWxpYXM6ICdyJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJyhyZSljb25maWd1cmUgdGhlIGFwcCB3aXRoIGxhc3QgcHVibGlzaGVkIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgc2hvdXRlbSBzZXJ2ZXInLFxyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9kdWN0aW9uOiB7XHJcbiAgICAgICAgYWxpYXM6ICdwJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ2NvbmZpZ3VyZSB0aGUgYXBwIGZvciBwcm9kdWN0aW9uIG1vZGUgYnVpbGQnLFxyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnVzYWdlKGBzaG91dGVtICR7Y29tbWFuZH0gXFxuXFxuJHtkZXNjcmlwdGlvbn1gKTtcclxufTtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoYXJncykge1xyXG4gIGF3YWl0IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcihhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBhcHBEaXIgPSBhd2FpdCBnZXRQbGF0Zm9ybVJvb3REaXIoKTtcclxuXHJcbiAgICBhd2FpdCBzZXRQbGF0Zm9ybUNvbmZpZyhhcHBEaXIsIHtcclxuICAgICAgLi4uYXdhaXQgZ2V0UGxhdGZvcm1Db25maWcoYXBwRGlyKSxcclxuICAgICAgcmVsZWFzZTogISFhcmdzLnJlbGVhc2UsXHJcbiAgICAgIHByb2R1Y3Rpb246ICEhYXJncy5wcm9kdWN0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICBhd2FpdCBjb25maWd1cmVQbGF0Zm9ybShhcHBEaXIpO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==