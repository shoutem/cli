'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _npm = require('../npm');

var npm = _interopRequireWildcard(_npm);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (extPath) {
  const args = [_path2.default.join(extPath, '**/*.js'), _path2.default.join(extPath, '**/*.jsx'), '--no-eslintrc', '--config', _path2.default.join(__dirname, 'extension-check-eslint-config.json'), '--ignore-pattern', 'node_modules'];

  return await npm.run(__dirname, 'extlint', args, ['--silent']);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9leHRsaW50L2luZGV4LmpzIl0sIm5hbWVzIjpbIm5wbSIsImV4dFBhdGgiLCJhcmdzIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEc7Ozs7OztrQkFFRyxnQkFBZ0JDLE9BQWhCLEVBQXlCO0FBQ3RDLFFBQU1DLE9BQU8sQ0FDWEMsZUFBS0MsSUFBTCxDQUFVSCxPQUFWLEVBQW1CLFNBQW5CLENBRFcsRUFFWEUsZUFBS0MsSUFBTCxDQUFVSCxPQUFWLEVBQW1CLFVBQW5CLENBRlcsRUFHWCxlQUhXLEVBSVgsVUFKVyxFQUlDRSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsb0NBQXJCLENBSkQsRUFLWCxrQkFMVyxFQUtTLGNBTFQsQ0FBYjs7QUFRQSxTQUFPLE1BQU1MLElBQUlNLEdBQUosQ0FBUUQsU0FBUixFQUFtQixTQUFuQixFQUE4QkgsSUFBOUIsRUFBb0MsQ0FBQyxVQUFELENBQXBDLENBQWI7QUFDRCxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIG5wbSBmcm9tICcuLi9ucG0nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKGV4dFBhdGgpIHtcclxuICBjb25zdCBhcmdzID0gW1xyXG4gICAgcGF0aC5qb2luKGV4dFBhdGgsICcqKi8qLmpzJyksXHJcbiAgICBwYXRoLmpvaW4oZXh0UGF0aCwgJyoqLyouanN4JyksXHJcbiAgICAnLS1uby1lc2xpbnRyYycsXHJcbiAgICAnLS1jb25maWcnLCBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZXh0ZW5zaW9uLWNoZWNrLWVzbGludC1jb25maWcuanNvbicpLFxyXG4gICAgJy0taWdub3JlLXBhdHRlcm4nLCAnbm9kZV9tb2R1bGVzJ1xyXG4gIF07XHJcblxyXG4gIHJldHVybiBhd2FpdCBucG0ucnVuKF9fZGlybmFtZSwgJ2V4dGxpbnQnLCBhcmdzLCBbJy0tc2lsZW50J10pO1xyXG59XHJcbiJdfQ==