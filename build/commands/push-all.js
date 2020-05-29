'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushAll = pushAll;

var _push = require('../commands/push');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _fsExtra = require('fs-extra');

var _errorHandler = require('../services/error-handler');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _serverEnv = require('../clients/server-env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function pushAll(args) {
  const extPaths = await _bluebird2.default.filter(args.paths, f => (0, _fsExtra.pathExists)(_path2.default.join(f, 'extension.json')));

  if (extPaths.length === 0) {
    console.log('No extensions found in current directory.');
    return [];
  }

  if (args.nopush) {
    return { pushed: extPaths, notPushed: [] };
  }

  let { pathsToPush } = args.noconfirm || (await (0, _inquirer.prompt)({
    type: 'checkbox',
    name: 'pathsToPush',
    message: `Check extensions you want to push to ${(0, _serverEnv.getHostEnvName)()}?`,
    choices: extPaths.concat(new _inquirer.Separator()),
    default: extPaths,
    pageSize: 20
  }));
  pathsToPush = pathsToPush || extPaths;

  const pushed = [];
  const notPushed = [];

  for (const extPath of pathsToPush) {
    try {
      await (0, _push.uploadExtension)(args, extPath);
      console.log(_user_messages2.default.push.complete());
      pushed.push(extPath);
    } catch (err) {
      await (0, _errorHandler.handleError)(err);
      notPushed.push(extPath);
    }
  }

  if (pushed.length > 0) {
    console.log(`Pushed:`);
    console.log(pushed.map(e => `  ${e}`).join('\n'));
  }

  if (notPushed.length > 0) {
    console.log(`Not pushed:`);
    console.log(notPushed.map(e => `  ${e}`).join('\n'));
  }

  return { pushed, notPushed };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wdXNoLWFsbC5qcyJdLCJuYW1lcyI6WyJwdXNoQWxsIiwiYXJncyIsImV4dFBhdGhzIiwiYmx1ZWJpcmQiLCJmaWx0ZXIiLCJwYXRocyIsImYiLCJwYXRoIiwiam9pbiIsImxlbmd0aCIsImNvbnNvbGUiLCJsb2ciLCJub3B1c2giLCJwdXNoZWQiLCJub3RQdXNoZWQiLCJwYXRoc1RvUHVzaCIsIm5vY29uZmlybSIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImNob2ljZXMiLCJjb25jYXQiLCJTZXBhcmF0b3IiLCJkZWZhdWx0IiwicGFnZVNpemUiLCJleHRQYXRoIiwibXNnIiwicHVzaCIsImNvbXBsZXRlIiwiZXJyIiwibWFwIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFTc0JBLE8sR0FBQUEsTzs7QUFUdEI7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxlQUFlQSxPQUFmLENBQXVCQyxJQUF2QixFQUE2QjtBQUNsQyxRQUFNQyxXQUFXLE1BQU1DLG1CQUFTQyxNQUFULENBQWdCSCxLQUFLSSxLQUFyQixFQUE0QkMsS0FBSyx5QkFBV0MsZUFBS0MsSUFBTCxDQUFVRixDQUFWLEVBQWEsZ0JBQWIsQ0FBWCxDQUFqQyxDQUF2Qjs7QUFFQSxNQUFJSixTQUFTTyxNQUFULEtBQW9CLENBQXhCLEVBQTJCO0FBQ3pCQyxZQUFRQyxHQUFSLENBQVksMkNBQVo7QUFDQSxXQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFJVixLQUFLVyxNQUFULEVBQWlCO0FBQ2YsV0FBTyxFQUFFQyxRQUFRWCxRQUFWLEVBQW9CWSxXQUFXLEVBQS9CLEVBQVA7QUFDRDs7QUFFRCxNQUFJLEVBQUVDLFdBQUYsS0FBa0JkLEtBQUtlLFNBQUwsS0FBa0IsTUFBTSxzQkFBTztBQUNuREMsVUFBTSxVQUQ2QztBQUVuREMsVUFBTSxhQUY2QztBQUduREMsYUFBVSx3Q0FBdUMsZ0NBQWlCLEdBSGY7QUFJbkRDLGFBQVNsQixTQUFTbUIsTUFBVCxDQUFnQixJQUFJQyxtQkFBSixFQUFoQixDQUowQztBQUtuREMsYUFBU3JCLFFBTDBDO0FBTW5Ec0IsY0FBVTtBQU55QyxHQUFQLENBQXhCLENBQXRCO0FBUUFULGdCQUFjQSxlQUFlYixRQUE3Qjs7QUFFQSxRQUFNVyxTQUFTLEVBQWY7QUFDQSxRQUFNQyxZQUFZLEVBQWxCOztBQUVBLE9BQUssTUFBTVcsT0FBWCxJQUFzQlYsV0FBdEIsRUFBbUM7QUFDakMsUUFBSztBQUNILFlBQU0sMkJBQWdCZCxJQUFoQixFQUFzQndCLE9BQXRCLENBQU47QUFDQWYsY0FBUUMsR0FBUixDQUFZZSx3QkFBSUMsSUFBSixDQUFTQyxRQUFULEVBQVo7QUFDQWYsYUFBT2MsSUFBUCxDQUFZRixPQUFaO0FBQ0QsS0FKRCxDQUlFLE9BQU9JLEdBQVAsRUFBWTtBQUNaLFlBQU0sK0JBQVlBLEdBQVosQ0FBTjtBQUNBZixnQkFBVWEsSUFBVixDQUFlRixPQUFmO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJWixPQUFPSixNQUFQLEdBQWdCLENBQXBCLEVBQXVCO0FBQ3JCQyxZQUFRQyxHQUFSLENBQWEsU0FBYjtBQUNBRCxZQUFRQyxHQUFSLENBQVlFLE9BQU9pQixHQUFQLENBQVdDLEtBQU0sS0FBSUEsQ0FBRSxFQUF2QixFQUEwQnZCLElBQTFCLENBQStCLElBQS9CLENBQVo7QUFDRDs7QUFFRCxNQUFJTSxVQUFVTCxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCQyxZQUFRQyxHQUFSLENBQWEsYUFBYjtBQUNBRCxZQUFRQyxHQUFSLENBQVlHLFVBQVVnQixHQUFWLENBQWNDLEtBQU0sS0FBSUEsQ0FBRSxFQUExQixFQUE2QnZCLElBQTdCLENBQWtDLElBQWxDLENBQVo7QUFDRDs7QUFFRCxTQUFPLEVBQUVLLE1BQUYsRUFBVUMsU0FBVixFQUFQO0FBQ0QiLCJmaWxlIjoicHVzaC1hbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1cGxvYWRFeHRlbnNpb24gfSBmcm9tICcuLi9jb21tYW5kcy9wdXNoJztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IHsgcGF0aEV4aXN0cyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuaW1wb3J0IGJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IHByb21wdCwgU2VwYXJhdG9yIH0gZnJvbSAnaW5xdWlyZXInO1xyXG5pbXBvcnQgeyBnZXRIb3N0RW52TmFtZSB9IGZyb20gJy4uL2NsaWVudHMvc2VydmVyLWVudic7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHVzaEFsbChhcmdzKSB7XHJcbiAgY29uc3QgZXh0UGF0aHMgPSBhd2FpdCBibHVlYmlyZC5maWx0ZXIoYXJncy5wYXRocywgZiA9PiBwYXRoRXhpc3RzKHBhdGguam9pbihmLCAnZXh0ZW5zaW9uLmpzb24nKSkpO1xyXG5cclxuICBpZiAoZXh0UGF0aHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTm8gZXh0ZW5zaW9ucyBmb3VuZCBpbiBjdXJyZW50IGRpcmVjdG9yeS4nKTtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGlmIChhcmdzLm5vcHVzaCkge1xyXG4gICAgcmV0dXJuIHsgcHVzaGVkOiBleHRQYXRocywgbm90UHVzaGVkOiBbXSB9O1xyXG4gIH1cclxuXHJcbiAgbGV0IHsgcGF0aHNUb1B1c2ggfSA9IGFyZ3Mubm9jb25maXJtIHx8IGF3YWl0IHByb21wdCh7XHJcbiAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgbmFtZTogJ3BhdGhzVG9QdXNoJyxcclxuICAgIG1lc3NhZ2U6IGBDaGVjayBleHRlbnNpb25zIHlvdSB3YW50IHRvIHB1c2ggdG8gJHtnZXRIb3N0RW52TmFtZSgpfT9gLFxyXG4gICAgY2hvaWNlczogZXh0UGF0aHMuY29uY2F0KG5ldyBTZXBhcmF0b3IoKSksXHJcbiAgICBkZWZhdWx0OiBleHRQYXRocyxcclxuICAgIHBhZ2VTaXplOiAyMFxyXG4gIH0pO1xyXG4gIHBhdGhzVG9QdXNoID0gcGF0aHNUb1B1c2ggfHwgZXh0UGF0aHM7XHJcblxyXG4gIGNvbnN0IHB1c2hlZCA9IFtdO1xyXG4gIGNvbnN0IG5vdFB1c2hlZCA9IFtdO1xyXG5cclxuICBmb3IgKGNvbnN0IGV4dFBhdGggb2YgcGF0aHNUb1B1c2gpIHtcclxuICAgIHRyeSAge1xyXG4gICAgICBhd2FpdCB1cGxvYWRFeHRlbnNpb24oYXJncywgZXh0UGF0aCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1zZy5wdXNoLmNvbXBsZXRlKCkpO1xyXG4gICAgICBwdXNoZWQucHVzaChleHRQYXRoKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBhd2FpdCBoYW5kbGVFcnJvcihlcnIpO1xyXG4gICAgICBub3RQdXNoZWQucHVzaChleHRQYXRoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwdXNoZWQubGVuZ3RoID4gMCkge1xyXG4gICAgY29uc29sZS5sb2coYFB1c2hlZDpgKTtcclxuICAgIGNvbnNvbGUubG9nKHB1c2hlZC5tYXAoZSA9PiBgICAke2V9YCkuam9pbignXFxuJykpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG5vdFB1c2hlZC5sZW5ndGggPiAwKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgTm90IHB1c2hlZDpgKTtcclxuICAgIGNvbnNvbGUubG9nKG5vdFB1c2hlZC5tYXAoZSA9PiBgICAke2V9YCkuam9pbignXFxuJykpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgcHVzaGVkLCBub3RQdXNoZWQgfTtcclxufVxyXG4iXX0=