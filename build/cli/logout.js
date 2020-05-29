'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.description = undefined;
exports.handler = handler;
exports.builder = builder;

var _logout = require('../commands/logout');

var _logout2 = _interopRequireDefault(_logout);

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Erase all locally stored credentials.';
const command = exports.command = 'logout';
async function handler() {
  await (0, _errorHandler.executeAndHandleError)(_logout2.default);
}
function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvbG9nb3V0LmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJidWlsZGVyIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwibG9nb3V0IiwieWFyZ3MiLCJ1c2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBS3NCQSxPLEdBQUFBLE87UUFHTkMsTyxHQUFBQSxPOztBQVJoQjs7OztBQUNBOzs7O0FBRU8sTUFBTUMsb0NBQWMsdUNBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsUUFBaEI7QUFDQSxlQUFlSCxPQUFmLEdBQXlCO0FBQzlCLFFBQU0seUNBQXNCSSxnQkFBdEIsQ0FBTjtBQUNEO0FBQ00sU0FBU0gsT0FBVCxDQUFpQkksS0FBakIsRUFBd0I7QUFDN0IsU0FBT0EsTUFBTUMsS0FBTixDQUFhLFdBQVVILE9BQVEsT0FBTUQsV0FBWSxFQUFqRCxDQUFQO0FBQ0QiLCJmaWxlIjoibG9nb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZ291dCBmcm9tICcuLi9jb21tYW5kcy9sb2dvdXQnO1xyXG5pbXBvcnQgeyBleGVjdXRlQW5kSGFuZGxlRXJyb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdFcmFzZSBhbGwgbG9jYWxseSBzdG9yZWQgY3JlZGVudGlhbHMuJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAnbG9nb3V0JztcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XHJcbiAgYXdhaXQgZXhlY3V0ZUFuZEhhbmRsZUVycm9yKGxvZ291dCk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkZXIoeWFyZ3MpIHtcclxuICByZXR1cm4geWFyZ3MudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfVxcblxcbiR7ZGVzY3JpcHRpb259YCk7XHJcbn1cclxuIl19