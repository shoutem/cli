'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.command = exports.description = undefined;

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _services = require('../../config/services');

var _services2 = _interopRequireDefault(_services);

var _platform = require('../services/platform');

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Opens the app in the shoutem builder dashboard using default browser';
const command = exports.command = 'builder [appId]';
const builder = exports.builder = yargs => {
  return yargs.usage(`shoutem ${command} \n\n${description}`);
};

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(async () => {
  const appId = args.appId || (await (0, _platform.getPlatformConfig)()).appId;
  const url = `${_services2.default.appBuilder}/app/${appId}`;
  console.log(url);
  (0, _opn2.default)(url, { wait: false });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvYnVpbGRlci5qcyJdLCJuYW1lcyI6WyJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJ1c2FnZSIsImhhbmRsZXIiLCJhcmdzIiwiYXBwSWQiLCJ1cmwiLCJzZXJ2aWNlcyIsImFwcEJ1aWxkZXIiLCJjb25zb2xlIiwibG9nIiwid2FpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVPLE1BQU1BLG9DQUFjLHNFQUFwQjtBQUNBLE1BQU1DLDRCQUFVLGlCQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLEtBREksQ0FDRyxXQUFVSCxPQUFRLFFBQU9ELFdBQVksRUFEeEMsQ0FBUDtBQUVELENBSE07O0FBS0EsTUFBTUssNEJBQVVDLFFBQVEseUNBQXNCLFlBQVk7QUFDL0QsUUFBTUMsUUFBUUQsS0FBS0MsS0FBTCxJQUFjLENBQUMsTUFBTSxrQ0FBUCxFQUE0QkEsS0FBeEQ7QUFDQSxRQUFNQyxNQUFPLEdBQUVDLG1CQUFTQyxVQUFXLFFBQU9ILEtBQU0sRUFBaEQ7QUFDQUksVUFBUUMsR0FBUixDQUFZSixHQUFaO0FBQ0EscUJBQUlBLEdBQUosRUFBUyxFQUFFSyxNQUFNLEtBQVIsRUFBVDtBQUNELENBTDhCLENBQXhCIiwiZmlsZSI6ImJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3BuIGZyb20gJ29wbic7XHJcbmltcG9ydCBzZXJ2aWNlcyBmcm9tICcuLi8uLi9jb25maWcvc2VydmljZXMnO1xyXG5pbXBvcnQge2dldFBsYXRmb3JtQ29uZmlnfSBmcm9tIFwiLi4vc2VydmljZXMvcGxhdGZvcm1cIjtcclxuaW1wb3J0IHtleGVjdXRlQW5kSGFuZGxlRXJyb3J9IGZyb20gXCIuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnT3BlbnMgdGhlIGFwcCBpbiB0aGUgc2hvdXRlbSBidWlsZGVyIGRhc2hib2FyZCB1c2luZyBkZWZhdWx0IGJyb3dzZXInO1xyXG5leHBvcnQgY29uc3QgY29tbWFuZCA9ICdidWlsZGVyIFthcHBJZF0nO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHtcclxuICByZXR1cm4geWFyZ3NcclxuICAgIC51c2FnZShgc2hvdXRlbSAke2NvbW1hbmR9IFxcblxcbiR7ZGVzY3JpcHRpb259YCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFyZ3MgPT4gZXhlY3V0ZUFuZEhhbmRsZUVycm9yKGFzeW5jICgpID0+IHtcclxuICBjb25zdCBhcHBJZCA9IGFyZ3MuYXBwSWQgfHwgKGF3YWl0IGdldFBsYXRmb3JtQ29uZmlnKCkpLmFwcElkO1xyXG4gIGNvbnN0IHVybCA9IGAke3NlcnZpY2VzLmFwcEJ1aWxkZXJ9L2FwcC8ke2FwcElkfWA7XHJcbiAgY29uc29sZS5sb2codXJsKTtcclxuICBvcG4odXJsLCB7IHdhaXQ6IGZhbHNlIH0pO1xyXG59KTtcclxuIl19