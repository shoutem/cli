'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cacheEnv = require('../services/cache-env');

var cache = _interopRequireWildcard(_cacheEnv);

var _authService = require('../clients/auth-service');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = async function logout() {
  await cache.setValue('developer', null);
  await (0, _authService.clearTokens)();
  console.log(_user_messages2.default.logout.complete());
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9sb2dvdXQuanMiXSwibmFtZXMiOlsiY2FjaGUiLCJsb2dvdXQiLCJzZXRWYWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJtc2ciLCJjb21wbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0lBQVlBLEs7O0FBQ1o7O0FBQ0E7Ozs7Ozs7O2tCQUVlLGVBQWVDLE1BQWYsR0FBd0I7QUFDckMsUUFBTUQsTUFBTUUsUUFBTixDQUFlLFdBQWYsRUFBNEIsSUFBNUIsQ0FBTjtBQUNBLFFBQU0sK0JBQU47QUFDQUMsVUFBUUMsR0FBUixDQUFZQyx3QkFBSUosTUFBSixDQUFXSyxRQUFYLEVBQVo7QUFDRCxDIiwiZmlsZSI6ImxvZ291dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNhY2hlIGZyb20gJy4uL3NlcnZpY2VzL2NhY2hlLWVudic7XHJcbmltcG9ydCB7IGNsZWFyVG9rZW5zIH0gZnJvbSAnLi4vY2xpZW50cy9hdXRoLXNlcnZpY2UnO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIGF3YWl0IGNhY2hlLnNldFZhbHVlKCdkZXZlbG9wZXInLCBudWxsKTtcclxuICBhd2FpdCBjbGVhclRva2VucygpO1xyXG4gIGNvbnNvbGUubG9nKG1zZy5sb2dvdXQuY29tcGxldGUoKSk7XHJcbn1cclxuIl19