'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _services = require('../../config/services');

var _services2 = _interopRequireDefault(_services);

var _install = require('../commands/install');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _login = require('../commands/login');

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Install the current extension to an application.';

const command = exports.command = 'install';
const builder = exports.builder = yargs => {
  return yargs.options({
    app: {
      alias: 'a',
      description: 'app id to install current extension to',
      requiresArg: true
    },
    new: {
      alias: 'n',
      description: 'install to a new app with given name',
      type: 'string'
    } }).usage(`usage: shoutem ${command} [options]\n\n${description}`);
};

async function handler(options) {
  try {
    await (0, _login.ensureUserIsLoggedIn)();
    const appCreationRequested = options.new || options.new === '';

    let appId;
    if (appCreationRequested) {
      if (options.app) {
        throw new Error('`app` and `new` flags can\'t be used together');
      }
      appId = (await (0, _install.createNewApp)(options.new || 'My Blank App')).id;
    } else if (options.app) {
      appId = options.app;
    } else {
      appId = (await (0, _install.ensureApp)()).id;
    }

    await (0, _install.installLocalExtension)(appId);

    console.log(_user_messages2.default.install.complete());
    const url = `${_services2.default.appBuilder}/app/${appId}`;
    console.log(_user_messages2.default.install.seeNewInBrowser(url));
  } catch (err) {
    await (0, _errorHandler.handleError)(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5zdGFsbC5qcyJdLCJuYW1lcyI6WyJoYW5kbGVyIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiYnVpbGRlciIsInlhcmdzIiwib3B0aW9ucyIsImFwcCIsImFsaWFzIiwicmVxdWlyZXNBcmciLCJuZXciLCJ0eXBlIiwidXNhZ2UiLCJhcHBDcmVhdGlvblJlcXVlc3RlZCIsImFwcElkIiwiRXJyb3IiLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJtc2ciLCJpbnN0YWxsIiwiY29tcGxldGUiLCJ1cmwiLCJzZXJ2aWNlcyIsImFwcEJ1aWxkZXIiLCJzZWVOZXdJbkJyb3dzZXIiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7OztRQTZCc0JBLE8sR0FBQUEsTzs7QUE3QnRCOzs7O0FBQ0E7O0FBS0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVPLE1BQU1DLG9DQUFjLGtEQUFwQjs7QUFFQSxNQUFNQyw0QkFBVSxTQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxTQUFLO0FBQ0hDLGFBQU8sR0FESjtBQUVITixtQkFBYSx3Q0FGVjtBQUdITyxtQkFBYTtBQUhWLEtBREU7QUFNUEMsU0FBSztBQUNIRixhQUFPLEdBREo7QUFFSE4sbUJBQWEsc0NBRlY7QUFHSFMsWUFBTTtBQUhILEtBTkUsRUFESixFQVlKQyxLQVpJLENBWUcsa0JBQWlCVCxPQUFRLGlCQUFnQkQsV0FBWSxFQVp4RCxDQUFQO0FBYUQsQ0FkTTs7QUFnQkEsZUFBZUQsT0FBZixDQUF1QkssT0FBdkIsRUFBZ0M7QUFDckMsTUFBSTtBQUNGLFVBQU0sa0NBQU47QUFDQSxVQUFNTyx1QkFBdUJQLFFBQVFJLEdBQVIsSUFBZUosUUFBUUksR0FBUixLQUFnQixFQUE1RDs7QUFFQSxRQUFJSSxLQUFKO0FBQ0EsUUFBSUQsb0JBQUosRUFBMEI7QUFDeEIsVUFBSVAsUUFBUUMsR0FBWixFQUFpQjtBQUNmLGNBQU0sSUFBSVEsS0FBSixDQUFVLCtDQUFWLENBQU47QUFDRDtBQUNERCxjQUFRLENBQUMsTUFBTSwyQkFBYVIsUUFBUUksR0FBUixJQUFlLGNBQTVCLENBQVAsRUFBb0RNLEVBQTVEO0FBQ0QsS0FMRCxNQUtPLElBQUlWLFFBQVFDLEdBQVosRUFBaUI7QUFDdEJPLGNBQVFSLFFBQVFDLEdBQWhCO0FBQ0QsS0FGTSxNQUVBO0FBQ0xPLGNBQVEsQ0FBQyxNQUFNLHlCQUFQLEVBQW9CRSxFQUE1QjtBQUNEOztBQUVELFVBQU0sb0NBQXNCRixLQUF0QixDQUFOOztBQUVBRyxZQUFRQyxHQUFSLENBQVlDLHdCQUFJQyxPQUFKLENBQVlDLFFBQVosRUFBWjtBQUNBLFVBQU1DLE1BQU8sR0FBRUMsbUJBQVNDLFVBQVcsUUFBT1YsS0FBTSxFQUFoRDtBQUNBRyxZQUFRQyxHQUFSLENBQVlDLHdCQUFJQyxPQUFKLENBQVlLLGVBQVosQ0FBNEJILEdBQTVCLENBQVo7QUFDRCxHQXJCRCxDQXFCRSxPQUFPSSxHQUFQLEVBQVk7QUFDWixVQUFNLCtCQUFZQSxHQUFaLENBQU47QUFDRDtBQUNGIiwiZmlsZSI6Imluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZXMgZnJvbSAnLi4vLi4vY29uZmlnL3NlcnZpY2VzJztcclxuaW1wb3J0IHtcclxuICBjcmVhdGVOZXdBcHAsXHJcbiAgZW5zdXJlQXBwLFxyXG4gIGluc3RhbGxMb2NhbEV4dGVuc2lvbixcclxufSBmcm9tICcuLi9jb21tYW5kcy9pbnN0YWxsJztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW5zdXJlVXNlcklzTG9nZ2VkSW4gfSBmcm9tICcuLi9jb21tYW5kcy9sb2dpbic7XHJcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5zdGFsbCB0aGUgY3VycmVudCBleHRlbnNpb24gdG8gYW4gYXBwbGljYXRpb24uJztcclxuXHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2luc3RhbGwnO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHtcclxuICByZXR1cm4geWFyZ3NcclxuICAgIC5vcHRpb25zKHtcclxuICAgICAgYXBwOiB7XHJcbiAgICAgICAgYWxpYXM6ICdhJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ2FwcCBpZCB0byBpbnN0YWxsIGN1cnJlbnQgZXh0ZW5zaW9uIHRvJyxcclxuICAgICAgICByZXF1aXJlc0FyZzogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBuZXc6IHtcclxuICAgICAgICBhbGlhczogJ24nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnaW5zdGFsbCB0byBhIG5ldyBhcHAgd2l0aCBnaXZlbiBuYW1lJyxcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xyXG4gICAgICB9fSlcclxuICAgIC51c2FnZShgdXNhZ2U6IHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIob3B0aW9ucykge1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBlbnN1cmVVc2VySXNMb2dnZWRJbigpO1xyXG4gICAgY29uc3QgYXBwQ3JlYXRpb25SZXF1ZXN0ZWQgPSBvcHRpb25zLm5ldyB8fCBvcHRpb25zLm5ldyA9PT0gJyc7XHJcblxyXG4gICAgbGV0IGFwcElkO1xyXG4gICAgaWYgKGFwcENyZWF0aW9uUmVxdWVzdGVkKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmFwcCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGFwcGAgYW5kIGBuZXdgIGZsYWdzIGNhblxcJ3QgYmUgdXNlZCB0b2dldGhlcicpO1xyXG4gICAgICB9XHJcbiAgICAgIGFwcElkID0gKGF3YWl0IGNyZWF0ZU5ld0FwcChvcHRpb25zLm5ldyB8fCAnTXkgQmxhbmsgQXBwJykpLmlkO1xyXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmFwcCkge1xyXG4gICAgICBhcHBJZCA9IG9wdGlvbnMuYXBwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBwSWQgPSAoYXdhaXQgZW5zdXJlQXBwKCkpLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IGluc3RhbGxMb2NhbEV4dGVuc2lvbihhcHBJZCk7XHJcblxyXG4gICAgY29uc29sZS5sb2cobXNnLmluc3RhbGwuY29tcGxldGUoKSk7XHJcbiAgICBjb25zdCB1cmwgPSBgJHtzZXJ2aWNlcy5hcHBCdWlsZGVyfS9hcHAvJHthcHBJZH1gO1xyXG4gICAgY29uc29sZS5sb2cobXNnLmluc3RhbGwuc2VlTmV3SW5Ccm93c2VyKHVybCkpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgYXdhaXQgaGFuZGxlRXJyb3IoZXJyKTtcclxuICB9XHJcbn1cclxuIl19