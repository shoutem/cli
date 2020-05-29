'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.isVerbose = isVerbose;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(msg, object) {
  if (isVerbose()) {
    console.log(msg, object);
  }
}

function isVerbose() {
  return _lodash2.default.includes(process.argv, '--verbose');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9sb2dnZXIuanMiXSwibmFtZXMiOlsiaW5mbyIsImlzVmVyYm9zZSIsIm1zZyIsIm9iamVjdCIsImNvbnNvbGUiLCJsb2ciLCJfIiwiaW5jbHVkZXMiLCJwcm9jZXNzIiwiYXJndiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFFZ0JBLEksR0FBQUEsSTtRQU1BQyxTLEdBQUFBLFM7O0FBUmhCOzs7Ozs7QUFFTyxTQUFTRCxJQUFULENBQWNFLEdBQWQsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ2hDLE1BQUlGLFdBQUosRUFBaUI7QUFDZkcsWUFBUUMsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFqQjtBQUNEO0FBQ0Y7O0FBRU0sU0FBU0YsU0FBVCxHQUFxQjtBQUMxQixTQUFPSyxpQkFBRUMsUUFBRixDQUFXQyxRQUFRQyxJQUFuQixFQUF5QixXQUF6QixDQUFQO0FBQ0QiLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmZvKG1zZywgb2JqZWN0KSB7XHJcbiAgaWYgKGlzVmVyYm9zZSgpKSB7XHJcbiAgICBjb25zb2xlLmxvZyhtc2csIG9iamVjdCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNWZXJib3NlKCkge1xyXG4gIHJldHVybiBfLmluY2x1ZGVzKHByb2Nlc3MuYXJndiwgJy0tdmVyYm9zZScpO1xyXG59XHJcbiJdfQ==