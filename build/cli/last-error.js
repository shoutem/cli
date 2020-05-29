'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.description = undefined;
exports.handler = handler;

require('colors');

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _cacheEnv = require('../services/cache-env');

var cache = _interopRequireWildcard(_cacheEnv);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = null;
const command = exports.command = 'last-error';
async function handler() {
  const lastError = await cache.getValue('last-error');
  if (lastError) {
    console.log(_prettyjson2.default.render(lastError, {
      keysColor: 'cyan',
      numberColor: 'white'
    }));
    console.log(`\nIf you think this error is caused by bug in the shoutem command, you can report the issue here: ${"https://github.com/shoutem/cli/issues".bold}`.yellow);
  } else {
    console.log('No error'.green);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvbGFzdC1lcnJvci5qcyJdLCJuYW1lcyI6WyJoYW5kbGVyIiwiY2FjaGUiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJsYXN0RXJyb3IiLCJnZXRWYWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJwcmV0dHlKc29uIiwicmVuZGVyIiwia2V5c0NvbG9yIiwibnVtYmVyQ29sb3IiLCJib2xkIiwieWVsbG93IiwiZ3JlZW4iXSwibWFwcGluZ3MiOiI7Ozs7OztRQU1zQkEsTyxHQUFBQSxPOztBQU50Qjs7QUFDQTs7OztBQUNBOztJQUFZQyxLOzs7Ozs7QUFFTCxNQUFNQyxvQ0FBYyxJQUFwQjtBQUNBLE1BQU1DLDRCQUFVLFlBQWhCO0FBQ0EsZUFBZUgsT0FBZixHQUF5QjtBQUM5QixRQUFNSSxZQUFZLE1BQU1ILE1BQU1JLFFBQU4sQ0FBZSxZQUFmLENBQXhCO0FBQ0EsTUFBSUQsU0FBSixFQUFlO0FBQ2JFLFlBQVFDLEdBQVIsQ0FBWUMscUJBQVdDLE1BQVgsQ0FBa0JMLFNBQWxCLEVBQTZCO0FBQ3ZDTSxpQkFBVyxNQUQ0QjtBQUV2Q0MsbUJBQWE7QUFGMEIsS0FBN0IsQ0FBWjtBQUlBTCxZQUFRQyxHQUFSLENBQWEscUdBQW9HLHdDQUF3Q0ssSUFBSyxFQUFsSixDQUFvSkMsTUFBaEs7QUFDRCxHQU5ELE1BTU87QUFDTFAsWUFBUUMsR0FBUixDQUFZLFdBQVdPLEtBQXZCO0FBQ0Q7QUFDRiIsImZpbGUiOiJsYXN0LWVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjb2xvcnMnO1xyXG5pbXBvcnQgcHJldHR5SnNvbiBmcm9tICdwcmV0dHlqc29uJztcclxuaW1wb3J0ICogYXMgY2FjaGUgZnJvbSAnLi4vc2VydmljZXMvY2FjaGUtZW52JztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9IG51bGw7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2xhc3QtZXJyb3InO1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcigpIHtcclxuICBjb25zdCBsYXN0RXJyb3IgPSBhd2FpdCBjYWNoZS5nZXRWYWx1ZSgnbGFzdC1lcnJvcicpO1xyXG4gIGlmIChsYXN0RXJyb3IpIHtcclxuICAgIGNvbnNvbGUubG9nKHByZXR0eUpzb24ucmVuZGVyKGxhc3RFcnJvciwge1xyXG4gICAgICBrZXlzQ29sb3I6ICdjeWFuJyxcclxuICAgICAgbnVtYmVyQ29sb3I6ICd3aGl0ZSdcclxuICAgIH0pKTtcclxuICAgIGNvbnNvbGUubG9nKGBcXG5JZiB5b3UgdGhpbmsgdGhpcyBlcnJvciBpcyBjYXVzZWQgYnkgYnVnIGluIHRoZSBzaG91dGVtIGNvbW1hbmQsIHlvdSBjYW4gcmVwb3J0IHRoZSBpc3N1ZSBoZXJlOiAke1wiaHR0cHM6Ly9naXRodWIuY29tL3Nob3V0ZW0vY2xpL2lzc3Vlc1wiLmJvbGR9YC55ZWxsb3cpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZygnTm8gZXJyb3InLmdyZWVuKTtcclxuICB9XHJcbn1cclxuIl19