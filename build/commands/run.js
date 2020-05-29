'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _tunnel = require('../services/tunnel');

var tunnel = _interopRequireWildcard(_tunnel);

var _reactNative = require('../services/react-native');

var _qrGenerator = require('../commands/qr-generator');

var _analytics = require('../services/analytics');

var analytics = _interopRequireWildcard(_analytics);

var _errorHandler = require('../services/error-handler');

var _login = require('./login');

var _platform = require('../services/platform');

var _commandExists = require('../services/command-exists');

var _commandExists2 = _interopRequireDefault(_commandExists);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (options) {
  try {
    analytics.setAppId((await (0, _platform.getPlatformConfig)()).appId);
    await (0, _login.ensureUserIsLoggedIn)();

    const { packagerProcess } = await (0, _reactNative.startPackager)((await (0, _platform.getPlatformRootDir)()));

    if (options.local) {
      console.log('Make sure that the phone running Shoutem app is connected to the same network as this computer'.yellow);
      if (process.platform === 'win32') {
        console.log('If Shoutem app on your phone fails to load, try opening the 8081 TCP port manually from your Windows Firewall or disabling the firewall temporarily'.yellow);
      } else {
        console.log('Make sure that the 8081 TCP port is not blocked on this computer'.yellow);
      }
      await (0, _qrGenerator.printMobilizerQR)(_ip2.default.address(), 8081, options);
    } else {
      await (0, _qrGenerator.printMobilizerQR)(_url2.default.parse((await tunnel.start(8081))).hostname, 80, options);
    }

    console.log('Keep this process running if app is used in debug mode'.bold.yellow);
    await packagerProcess;
  } catch (err) {
    if (!/^win/.test(process.platform) && !(await (0, _commandExists2.default)('watchman'))) {
      console.log('HINT: You should probably install Facebook\'s `watchman` before running `shoutem run` command'.bold.yellow);
    }
    await tunnel.stop();
    await (0, _errorHandler.handleError)(err);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9ydW4uanMiXSwibmFtZXMiOlsidHVubmVsIiwiYW5hbHl0aWNzIiwib3B0aW9ucyIsInNldEFwcElkIiwiYXBwSWQiLCJwYWNrYWdlclByb2Nlc3MiLCJsb2NhbCIsImNvbnNvbGUiLCJsb2ciLCJ5ZWxsb3ciLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJpcCIsImFkZHJlc3MiLCJ1cmwiLCJwYXJzZSIsInN0YXJ0IiwiaG9zdG5hbWUiLCJib2xkIiwiZXJyIiwidGVzdCIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsTTs7QUFDWjs7QUFDQTs7QUFDQTs7SUFBWUMsUzs7QUFDWjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7a0JBRWUsZ0JBQWdCQyxPQUFoQixFQUF5QjtBQUN0QyxNQUFJO0FBQ0ZELGNBQVVFLFFBQVYsQ0FBbUIsQ0FBQyxNQUFNLGtDQUFQLEVBQTRCQyxLQUEvQztBQUNBLFVBQU0sa0NBQU47O0FBRUEsVUFBTSxFQUFFQyxlQUFGLEtBQXNCLE1BQU0saUNBQWMsTUFBTSxtQ0FBcEIsRUFBbEM7O0FBRUEsUUFBSUgsUUFBUUksS0FBWixFQUFtQjtBQUNqQkMsY0FBUUMsR0FBUixDQUFZLGlHQUFpR0MsTUFBN0c7QUFDQSxVQUFJQyxRQUFRQyxRQUFSLEtBQXFCLE9BQXpCLEVBQWtDO0FBQ2hDSixnQkFBUUMsR0FBUixDQUFZLHNKQUFzSkMsTUFBbEs7QUFDRCxPQUZELE1BRU87QUFDTEYsZ0JBQVFDLEdBQVIsQ0FBWSxtRUFBbUVDLE1BQS9FO0FBQ0Q7QUFDRCxZQUFNLG1DQUFpQkcsYUFBR0MsT0FBSCxFQUFqQixFQUErQixJQUEvQixFQUFxQ1gsT0FBckMsQ0FBTjtBQUNELEtBUkQsTUFRTztBQUNMLFlBQU0sbUNBQWlCWSxjQUFJQyxLQUFKLEVBQVUsTUFBTWYsT0FBT2dCLEtBQVAsQ0FBYSxJQUFiLENBQWhCLEdBQW9DQyxRQUFyRCxFQUErRCxFQUEvRCxFQUFtRWYsT0FBbkUsQ0FBTjtBQUNEOztBQUVESyxZQUFRQyxHQUFSLENBQVkseURBQXlEVSxJQUF6RCxDQUE4RFQsTUFBMUU7QUFDQSxVQUFNSixlQUFOO0FBQ0QsR0FwQkQsQ0FvQkUsT0FBT2MsR0FBUCxFQUFZO0FBQ1osUUFBSSxDQUFDLE9BQU9DLElBQVAsQ0FBWVYsUUFBUUMsUUFBcEIsQ0FBRCxJQUFrQyxFQUFDLE1BQU0sNkJBQWMsVUFBZCxDQUFQLENBQXRDLEVBQXdFO0FBQ3RFSixjQUFRQyxHQUFSLENBQVksZ0dBQWdHVSxJQUFoRyxDQUFxR1QsTUFBakg7QUFDRDtBQUNELFVBQU1ULE9BQU9xQixJQUFQLEVBQU47QUFDQSxVQUFNLCtCQUFZRixHQUFaLENBQU47QUFDRDtBQUNGLEMiLCJmaWxlIjoicnVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgaXAgZnJvbSAnaXAnO1xyXG5pbXBvcnQgKiBhcyB0dW5uZWwgZnJvbSAnLi4vc2VydmljZXMvdHVubmVsJztcclxuaW1wb3J0IHsgc3RhcnRQYWNrYWdlciB9IGZyb20gJy4uL3NlcnZpY2VzL3JlYWN0LW5hdGl2ZSc7XHJcbmltcG9ydCB7IHByaW50TW9iaWxpemVyUVIgfSBmcm9tICcuLi9jb21tYW5kcy9xci1nZW5lcmF0b3InO1xyXG5pbXBvcnQgKiBhcyBhbmFseXRpY3MgZnJvbSAnLi4vc2VydmljZXMvYW5hbHl0aWNzJztcclxuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuaW1wb3J0IHsgZW5zdXJlVXNlcklzTG9nZ2VkSW4gfSBmcm9tICcuL2xvZ2luJztcclxuaW1wb3J0IHsgZ2V0UGxhdGZvcm1Sb290RGlyLCBnZXRQbGF0Zm9ybUNvbmZpZyB9IGZyb20gJy4uL3NlcnZpY2VzL3BsYXRmb3JtJztcclxuaW1wb3J0IGNvbW1hbmRFeGlzdHMgZnJvbSAnLi4vc2VydmljZXMvY29tbWFuZC1leGlzdHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB0cnkge1xyXG4gICAgYW5hbHl0aWNzLnNldEFwcElkKChhd2FpdCBnZXRQbGF0Zm9ybUNvbmZpZygpKS5hcHBJZCk7XHJcbiAgICBhd2FpdCBlbnN1cmVVc2VySXNMb2dnZWRJbigpO1xyXG5cclxuICAgIGNvbnN0IHsgcGFja2FnZXJQcm9jZXNzIH0gPSBhd2FpdCBzdGFydFBhY2thZ2VyKGF3YWl0IGdldFBsYXRmb3JtUm9vdERpcigpKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5sb2NhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnTWFrZSBzdXJlIHRoYXQgdGhlIHBob25lIHJ1bm5pbmcgU2hvdXRlbSBhcHAgaXMgY29ubmVjdGVkIHRvIHRoZSBzYW1lIG5ldHdvcmsgYXMgdGhpcyBjb21wdXRlcicueWVsbG93KTtcclxuICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnSWYgU2hvdXRlbSBhcHAgb24geW91ciBwaG9uZSBmYWlscyB0byBsb2FkLCB0cnkgb3BlbmluZyB0aGUgODA4MSBUQ1AgcG9ydCBtYW51YWxseSBmcm9tIHlvdXIgV2luZG93cyBGaXJld2FsbCBvciBkaXNhYmxpbmcgdGhlIGZpcmV3YWxsIHRlbXBvcmFyaWx5Jy55ZWxsb3cpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdNYWtlIHN1cmUgdGhhdCB0aGUgODA4MSBUQ1AgcG9ydCBpcyBub3QgYmxvY2tlZCBvbiB0aGlzIGNvbXB1dGVyJy55ZWxsb3cpO1xyXG4gICAgICB9XHJcbiAgICAgIGF3YWl0IHByaW50TW9iaWxpemVyUVIoaXAuYWRkcmVzcygpLCA4MDgxLCBvcHRpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGF3YWl0IHByaW50TW9iaWxpemVyUVIodXJsLnBhcnNlKGF3YWl0IHR1bm5lbC5zdGFydCg4MDgxKSkuaG9zdG5hbWUsIDgwLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnS2VlcCB0aGlzIHByb2Nlc3MgcnVubmluZyBpZiBhcHAgaXMgdXNlZCBpbiBkZWJ1ZyBtb2RlJy5ib2xkLnllbGxvdyk7XHJcbiAgICBhd2FpdCBwYWNrYWdlclByb2Nlc3M7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBpZiAoIS9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pICYmICFhd2FpdCBjb21tYW5kRXhpc3RzKCd3YXRjaG1hbicpKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdISU5UOiBZb3Ugc2hvdWxkIHByb2JhYmx5IGluc3RhbGwgRmFjZWJvb2tcXCdzIGB3YXRjaG1hbmAgYmVmb3JlIHJ1bm5pbmcgYHNob3V0ZW0gcnVuYCBjb21tYW5kJy5ib2xkLnllbGxvdyk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0dW5uZWwuc3RvcCgpO1xyXG4gICAgYXdhaXQgaGFuZGxlRXJyb3IoZXJyKTtcclxuICB9XHJcbn1cclxuIl19