'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureYarnInstalled = ensureYarnInstalled;
exports.install = install;
exports.run = run;

var _childProcessPromise = require('child-process-promise');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _commandExists = require('./command-exists');

var _commandExists2 = _interopRequireDefault(_commandExists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureYarnInstalled() {
  if (!(await (0, _commandExists2.default)('yarn'))) {
    throw new Error(_user_messages2.default.yarn.missing());
  }
}

async function install(cwd = process.cwd()) {
  await ensureYarnInstalled();
  await (0, _childProcessPromise.spawn)('yarn', ['install'], { cwd, stdio: 'inherit' });
}

async function run(cwd, task, taskArgs = null, stdio = 'inherit') {
  await ensureYarnInstalled();
  const opts = { cwd, stdio };

  if (taskArgs) {
    return await (0, _childProcessPromise.spawn)('yarn', ['run', task, '--', ...taskArgs], opts);
  } else {
    return await (0, _childProcessPromise.spawn)('yarn', ['run', task], opts);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy95YXJuLmpzIl0sIm5hbWVzIjpbImVuc3VyZVlhcm5JbnN0YWxsZWQiLCJpbnN0YWxsIiwicnVuIiwiRXJyb3IiLCJtc2ciLCJ5YXJuIiwibWlzc2luZyIsImN3ZCIsInByb2Nlc3MiLCJzdGRpbyIsInRhc2siLCJ0YXNrQXJncyIsIm9wdHMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBSXNCQSxtQixHQUFBQSxtQjtRQU1BQyxPLEdBQUFBLE87UUFLQUMsRyxHQUFBQSxHOztBQWZ0Qjs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxlQUFlRixtQkFBZixHQUFxQztBQUMxQyxNQUFJLEVBQUMsTUFBTSw2QkFBYyxNQUFkLENBQVAsQ0FBSixFQUFrQztBQUNoQyxVQUFNLElBQUlHLEtBQUosQ0FBVUMsd0JBQUlDLElBQUosQ0FBU0MsT0FBVCxFQUFWLENBQU47QUFDRDtBQUNGOztBQUVNLGVBQWVMLE9BQWYsQ0FBdUJNLE1BQU1DLFFBQVFELEdBQVIsRUFBN0IsRUFBNEM7QUFDakQsUUFBTVAscUJBQU47QUFDQSxRQUFNLGdDQUFNLE1BQU4sRUFBYyxDQUFDLFNBQUQsQ0FBZCxFQUEyQixFQUFFTyxHQUFGLEVBQU9FLE9BQU8sU0FBZCxFQUEzQixDQUFOO0FBQ0Q7O0FBRU0sZUFBZVAsR0FBZixDQUFtQkssR0FBbkIsRUFBd0JHLElBQXhCLEVBQThCQyxXQUFXLElBQXpDLEVBQStDRixRQUFRLFNBQXZELEVBQWtFO0FBQ3ZFLFFBQU1ULHFCQUFOO0FBQ0EsUUFBTVksT0FBTyxFQUFDTCxHQUFELEVBQU1FLEtBQU4sRUFBYjs7QUFFQSxNQUFJRSxRQUFKLEVBQWM7QUFDWixXQUFPLE1BQU0sZ0NBQU0sTUFBTixFQUFjLENBQUMsS0FBRCxFQUFRRCxJQUFSLEVBQWMsSUFBZCxFQUFvQixHQUFHQyxRQUF2QixDQUFkLEVBQWdEQyxJQUFoRCxDQUFiO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxNQUFNLGdDQUFNLE1BQU4sRUFBYyxDQUFDLEtBQUQsRUFBUUYsSUFBUixDQUFkLEVBQTZCRSxJQUE3QixDQUFiO0FBQ0Q7QUFDRiIsImZpbGUiOiJ5YXJuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3Bhd24gfSBmcm9tICdjaGlsZC1wcm9jZXNzLXByb21pc2UnO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgY29tbWFuZEV4aXN0cyBmcm9tICcuL2NvbW1hbmQtZXhpc3RzJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbnN1cmVZYXJuSW5zdGFsbGVkKCkge1xyXG4gIGlmICghYXdhaXQgY29tbWFuZEV4aXN0cygneWFybicpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnLnlhcm4ubWlzc2luZygpKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnN0YWxsKGN3ZCA9IHByb2Nlc3MuY3dkKCkpIHtcclxuICBhd2FpdCBlbnN1cmVZYXJuSW5zdGFsbGVkKCk7XHJcbiAgYXdhaXQgc3Bhd24oJ3lhcm4nLCBbJ2luc3RhbGwnXSwgeyBjd2QsIHN0ZGlvOiAnaW5oZXJpdCcgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oY3dkLCB0YXNrLCB0YXNrQXJncyA9IG51bGwsIHN0ZGlvID0gJ2luaGVyaXQnKSB7XHJcbiAgYXdhaXQgZW5zdXJlWWFybkluc3RhbGxlZCgpO1xyXG4gIGNvbnN0IG9wdHMgPSB7Y3dkLCBzdGRpbyB9O1xyXG5cclxuICBpZiAodGFza0FyZ3MpIHtcclxuICAgIHJldHVybiBhd2FpdCBzcGF3bigneWFybicsIFsncnVuJywgdGFzaywgJy0tJywgLi4udGFza0FyZ3NdLCBvcHRzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGF3YWl0IHNwYXduKCd5YXJuJywgWydydW4nLCB0YXNrXSwgb3B0cyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==