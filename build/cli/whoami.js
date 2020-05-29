'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = exports.command = undefined;
exports.handler = handler;
exports.builder = builder;

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _cacheEnv = require('../services/cache-env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const command = exports.command = 'whoami';
const description = exports.description = 'Username of the current user.';
async function handler() {
  try {
    const dev = await (0, _cacheEnv.getValue)('developer');
    if (dev) {
      console.log(_user_messages2.default.login.complete(dev));
    } else {
      console.log('Not logged in. Try using `shoutem login`');
    }
  } catch (err) {
    console.log(err.message || err);
  }
}

function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvd2hvYW1pLmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJidWlsZGVyIiwiY29tbWFuZCIsImRlc2NyaXB0aW9uIiwiZGV2IiwiY29uc29sZSIsImxvZyIsIm1zZyIsImxvZ2luIiwiY29tcGxldGUiLCJlcnIiLCJtZXNzYWdlIiwieWFyZ3MiLCJ1c2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBS3NCQSxPLEdBQUFBLE87UUFhTkMsTyxHQUFBQSxPOztBQWxCaEI7Ozs7QUFDQTs7OztBQUVPLE1BQU1DLDRCQUFVLFFBQWhCO0FBQ0EsTUFBTUMsb0NBQWMsK0JBQXBCO0FBQ0EsZUFBZUgsT0FBZixHQUF5QjtBQUM5QixNQUFJO0FBQ0YsVUFBTUksTUFBTSxNQUFNLHdCQUFTLFdBQVQsQ0FBbEI7QUFDQSxRQUFJQSxHQUFKLEVBQVM7QUFDUEMsY0FBUUMsR0FBUixDQUFZQyx3QkFBSUMsS0FBSixDQUFVQyxRQUFWLENBQW1CTCxHQUFuQixDQUFaO0FBQ0QsS0FGRCxNQUVPO0FBQ0xDLGNBQVFDLEdBQVIsQ0FBWSwwQ0FBWjtBQUNEO0FBQ0YsR0FQRCxDQU9FLE9BQU9JLEdBQVAsRUFBWTtBQUNaTCxZQUFRQyxHQUFSLENBQVlJLElBQUlDLE9BQUosSUFBZUQsR0FBM0I7QUFDRDtBQUNGOztBQUVNLFNBQVNULE9BQVQsQ0FBaUJXLEtBQWpCLEVBQXdCO0FBQzdCLFNBQU9BLE1BQU1DLEtBQU4sQ0FBYSxXQUFVWCxPQUFRLE9BQU1DLFdBQVksRUFBakQsQ0FBUDtBQUNEIiwiZmlsZSI6Indob2FtaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtc2cgZnJvbSAnLi4vdXNlcl9tZXNzYWdlcyc7XHJcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi4vc2VydmljZXMvY2FjaGUtZW52JztcclxuXHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ3dob2FtaSc7XHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdVc2VybmFtZSBvZiB0aGUgY3VycmVudCB1c2VyLic7XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBkZXYgPSBhd2FpdCBnZXRWYWx1ZSgnZGV2ZWxvcGVyJyk7XHJcbiAgICBpZiAoZGV2KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1zZy5sb2dpbi5jb21wbGV0ZShkZXYpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdOb3QgbG9nZ2VkIGluLiBUcnkgdXNpbmcgYHNob3V0ZW0gbG9naW5gJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSB8fCBlcnIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkZXIoeWFyZ3MpIHtcclxuICByZXR1cm4geWFyZ3MudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfVxcblxcbiR7ZGVzY3JpcHRpb259YCk7XHJcbn1cclxuIl19