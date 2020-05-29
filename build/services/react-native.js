'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.ensureInstalled = ensureInstalled;
exports.startPackager = startPackager;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _childProcessPromise = require('child-process-promise');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _commandExists = require('./command-exists');

var _commandExists2 = _interopRequireDefault(_commandExists);

var _streamMatcher = require('./stream-matcher');

var _streamMatcher2 = _interopRequireDefault(_streamMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureInstalled() {
  try {
    if (!(await (0, _commandExists2.default)('react-native'))) {
      await (0, _childProcessPromise.spawn)('npm', ['install', '-g', 'react-native-cli'], { stdio: 'inherit', shell: true });
    }
  } catch (err) {
    throw new Error(_user_messages2.default.reactNative.missing());
  }
}

async function startPackager(cwd) {
  const spawned = (0, _childProcessPromise.spawn)('react-native', ['start'], {
    stdio: ['inherit', 'pipe', 'inherit'],
    cwd,
    shell: true,
    env: _extends({}, process.env, { FORCE_COLOR: true })
  });

  const { childProcess } = spawned;

  childProcess.stdout.pipe(process.stdout);

  // Promise.race() is required to avoid unhandled promise
  // rejection if react-packager fails before becoming 'ready'
  await _bluebird2.default.race([(0, _streamMatcher2.default)(childProcess.stdout, 'Loading dependency graph, done'), spawned]);

  return { packagerProcess: spawned };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9yZWFjdC1uYXRpdmUuanMiXSwibmFtZXMiOlsiZW5zdXJlSW5zdGFsbGVkIiwic3RhcnRQYWNrYWdlciIsInN0ZGlvIiwic2hlbGwiLCJlcnIiLCJFcnJvciIsIm1zZyIsInJlYWN0TmF0aXZlIiwibWlzc2luZyIsImN3ZCIsInNwYXduZWQiLCJlbnYiLCJwcm9jZXNzIiwiRk9SQ0VfQ09MT1IiLCJjaGlsZFByb2Nlc3MiLCJzdGRvdXQiLCJwaXBlIiwiUHJvbWlzZSIsInJhY2UiLCJwYWNrYWdlclByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBTXNCQSxlLEdBQUFBLGU7UUFVQUMsYSxHQUFBQSxhOztBQWhCdEI7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLGVBQWVELGVBQWYsR0FBaUM7QUFDdEMsTUFBSTtBQUNGLFFBQUksRUFBQyxNQUFNLDZCQUFjLGNBQWQsQ0FBUCxDQUFKLEVBQTBDO0FBQ3hDLFlBQU0sZ0NBQU0sS0FBTixFQUFhLENBQUMsU0FBRCxFQUFZLElBQVosRUFBa0Isa0JBQWxCLENBQWIsRUFBb0QsRUFBRUUsT0FBTyxTQUFULEVBQW9CQyxPQUFPLElBQTNCLEVBQXBELENBQU47QUFDRDtBQUNGLEdBSkQsQ0FJRSxPQUFPQyxHQUFQLEVBQVk7QUFDWixVQUFNLElBQUlDLEtBQUosQ0FBVUMsd0JBQUlDLFdBQUosQ0FBZ0JDLE9BQWhCLEVBQVYsQ0FBTjtBQUNEO0FBQ0Y7O0FBRU0sZUFBZVAsYUFBZixDQUE2QlEsR0FBN0IsRUFBa0M7QUFDdkMsUUFBTUMsVUFBVSxnQ0FBTSxjQUFOLEVBQXNCLENBQUMsT0FBRCxDQUF0QixFQUFpQztBQUM3Q1IsV0FBTyxDQUFDLFNBQUQsRUFBWSxNQUFaLEVBQW9CLFNBQXBCLENBRHNDO0FBRTdDTyxPQUY2QztBQUc3Q04sV0FBTyxJQUhzQztBQUk3Q1Esc0JBQVVDLFFBQVFELEdBQWxCLElBQXVCRSxhQUFhLElBQXBDO0FBSjZDLEdBQWpDLENBQWhCOztBQVFBLFFBQU0sRUFBRUMsWUFBRixLQUFtQkosT0FBekI7O0FBRUFJLGVBQWFDLE1BQWIsQ0FBb0JDLElBQXBCLENBQXlCSixRQUFRRyxNQUFqQzs7QUFFQTtBQUNBO0FBQ0EsUUFBTUUsbUJBQVFDLElBQVIsQ0FBYSxDQUNqQiw2QkFBY0osYUFBYUMsTUFBM0IsRUFBbUMsZ0NBQW5DLENBRGlCLEVBRWpCTCxPQUZpQixDQUFiLENBQU47O0FBS0EsU0FBTyxFQUFFUyxpQkFBaUJULE9BQW5CLEVBQVA7QUFDRCIsImZpbGUiOiJyZWFjdC1uYXRpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGQtcHJvY2Vzcy1wcm9taXNlJztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IGNvbW1hbmRFeGlzdHMgZnJvbSAnLi9jb21tYW5kLWV4aXN0cyc7XHJcbmltcG9ydCBzdHJlYW1NYXRjaGVyIGZyb20gJy4vc3RyZWFtLW1hdGNoZXInO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUluc3RhbGxlZCgpIHtcclxuICB0cnkge1xyXG4gICAgaWYgKCFhd2FpdCBjb21tYW5kRXhpc3RzKCdyZWFjdC1uYXRpdmUnKSkge1xyXG4gICAgICBhd2FpdCBzcGF3bignbnBtJywgWydpbnN0YWxsJywgJy1nJywgJ3JlYWN0LW5hdGl2ZS1jbGknXSwgeyBzdGRpbzogJ2luaGVyaXQnLCBzaGVsbDogdHJ1ZSB9KVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZy5yZWFjdE5hdGl2ZS5taXNzaW5nKCkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0UGFja2FnZXIoY3dkKSB7XHJcbiAgY29uc3Qgc3Bhd25lZCA9IHNwYXduKCdyZWFjdC1uYXRpdmUnLCBbJ3N0YXJ0J10sIHtcclxuICAgICAgc3RkaW86IFsnaW5oZXJpdCcsICdwaXBlJywgJ2luaGVyaXQnXSxcclxuICAgICAgY3dkLFxyXG4gICAgICBzaGVsbDogdHJ1ZSxcclxuICAgICAgZW52OiB7IC4uLnByb2Nlc3MuZW52LCBGT1JDRV9DT0xPUjogdHJ1ZSB9XHJcbiAgICB9XHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeyBjaGlsZFByb2Nlc3MgfSA9IHNwYXduZWQ7XHJcblxyXG4gIGNoaWxkUHJvY2Vzcy5zdGRvdXQucGlwZShwcm9jZXNzLnN0ZG91dCk7XHJcblxyXG4gIC8vIFByb21pc2UucmFjZSgpIGlzIHJlcXVpcmVkIHRvIGF2b2lkIHVuaGFuZGxlZCBwcm9taXNlXHJcbiAgLy8gcmVqZWN0aW9uIGlmIHJlYWN0LXBhY2thZ2VyIGZhaWxzIGJlZm9yZSBiZWNvbWluZyAncmVhZHknXHJcbiAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcclxuICAgIHN0cmVhbU1hdGNoZXIoY2hpbGRQcm9jZXNzLnN0ZG91dCwgJ0xvYWRpbmcgZGVwZW5kZW5jeSBncmFwaCwgZG9uZScpLFxyXG4gICAgc3Bhd25lZFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4geyBwYWNrYWdlclByb2Nlc3M6IHNwYXduZWQgfTtcclxufVxyXG4iXX0=