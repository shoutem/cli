'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _serverEnv = require('../clients/server-env');

var _services = require('../../config/services');

var _services2 = _interopRequireDefault(_services);

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _cacheEnv = require('../services/cache-env');

var _homeDir = require('../home-dir');

var _homeDir2 = _interopRequireDefault(_homeDir);

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (args) {
  const serverEnv = (0, _serverEnv.getHostEnvName)();

  if (args.all || serverEnv !== 'production') {
    console.log(_prettyjson2.default.render({ [_user_messages2.default.use.show(serverEnv)]: _services2.default }));
  }

  const developer = await (0, _cacheEnv.getValue)('developer');
  if (developer) {
    console.log(_user_messages2.default.login.complete(developer));
  }

  console.log(`Home directory: \`${(0, _homeDir2.default)()}\` (customizable through SHOUTEM_CLI_HOME env variable, may require restart of terminal)`);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zaG93LmpzIl0sIm5hbWVzIjpbImFyZ3MiLCJzZXJ2ZXJFbnYiLCJhbGwiLCJjb25zb2xlIiwibG9nIiwicHJldHR5SnNvbiIsInJlbmRlciIsIm1zZyIsInVzZSIsInNob3ciLCJhcGlzQ29uZmlnIiwiZGV2ZWxvcGVyIiwibG9naW4iLCJjb21wbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZSxnQkFBZUEsSUFBZixFQUFxQjtBQUNsQyxRQUFNQyxZQUFZLGdDQUFsQjs7QUFFQSxNQUFJRCxLQUFLRSxHQUFMLElBQVlELGNBQWMsWUFBOUIsRUFBNEM7QUFDMUNFLFlBQVFDLEdBQVIsQ0FBWUMscUJBQVdDLE1BQVgsQ0FBa0IsRUFBRSxDQUFDQyx3QkFBSUMsR0FBSixDQUFRQyxJQUFSLENBQWFSLFNBQWIsQ0FBRCxHQUEyQlMsa0JBQTdCLEVBQWxCLENBQVo7QUFDRDs7QUFFRCxRQUFNQyxZQUFZLE1BQU0sd0JBQVMsV0FBVCxDQUF4QjtBQUNBLE1BQUlBLFNBQUosRUFBZTtBQUNiUixZQUFRQyxHQUFSLENBQVlHLHdCQUFJSyxLQUFKLENBQVVDLFFBQVYsQ0FBbUJGLFNBQW5CLENBQVo7QUFDRDs7QUFFRFIsVUFBUUMsR0FBUixDQUFhLHFCQUFvQix3QkFBYSwwRkFBOUM7QUFDRCxDIiwiZmlsZSI6InNob3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRIb3N0RW52TmFtZSB9IGZyb20gJy4uL2NsaWVudHMvc2VydmVyLWVudic7XHJcbmltcG9ydCBhcGlzQ29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9zZXJ2aWNlcyc7XHJcbmltcG9ydCBtc2cgZnJvbSAnLi4vdXNlcl9tZXNzYWdlcyc7XHJcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi4vc2VydmljZXMvY2FjaGUtZW52JztcclxuaW1wb3J0IGdldEhvbWVEaXIgZnJvbSAnLi4vaG9tZS1kaXInO1xyXG5pbXBvcnQgcHJldHR5SnNvbiBmcm9tICdwcmV0dHlqc29uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uKGFyZ3MpIHtcclxuICBjb25zdCBzZXJ2ZXJFbnYgPSBnZXRIb3N0RW52TmFtZSgpO1xyXG5cclxuICBpZiAoYXJncy5hbGwgfHwgc2VydmVyRW52ICE9PSAncHJvZHVjdGlvbicpIHtcclxuICAgIGNvbnNvbGUubG9nKHByZXR0eUpzb24ucmVuZGVyKHsgW21zZy51c2Uuc2hvdyhzZXJ2ZXJFbnYpXTogYXBpc0NvbmZpZyB9KSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkZXZlbG9wZXIgPSBhd2FpdCBnZXRWYWx1ZSgnZGV2ZWxvcGVyJyk7XHJcbiAgaWYgKGRldmVsb3Blcikge1xyXG4gICAgY29uc29sZS5sb2cobXNnLmxvZ2luLmNvbXBsZXRlKGRldmVsb3BlcikpO1xyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coYEhvbWUgZGlyZWN0b3J5OiBcXGAke2dldEhvbWVEaXIoKX1cXGAgKGN1c3RvbWl6YWJsZSB0aHJvdWdoIFNIT1VURU1fQ0xJX0hPTUUgZW52IHZhcmlhYmxlLCBtYXkgcmVxdWlyZSByZXN0YXJ0IG9mIHRlcm1pbmFsKWApO1xyXG59XHJcbiJdfQ==