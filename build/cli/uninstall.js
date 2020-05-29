'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _appManager = require('../clients/app-manager');

var _localExtensions = require('../clients/local-extensions');

var localExtensions = _interopRequireWildcard(_localExtensions);

var _extensionManager = require('../clients/extension-manager');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const description = exports.description = `Uninstall current extension from an app.`;
const command = exports.command = 'uninstall';
const builder = exports.builder = yargs => {
  return yargs.options({
    app: {
      alias: 'a',
      description: 'uninstall local extension from an app',
      requiresArg: true,
      demand: true
    }
  }).usage(`shoutem ${command} [options]\n\n${description}`);
};

async function handler(args) {
  const appId = args.app;

  try {
    const canonicalName = await localExtensions.getExtensionCanonicalName();
    const extensionId = await (0, _extensionManager.getExtensionId)(canonicalName);

    if (!extensionId) {
      throw new Error(_user_messages2.default.uninstall.missingExtension());
    }

    const installations = await (0, _appManager.getExtInstallations)(appId);
    const installation = installations.filter(inst => inst.extension === extensionId)[0];

    if (!installation) {
      throw new Error(_user_messages2.default.uninstall.missingInstallation());
    }

    await (0, _appManager.uninstallExtension)(appId, installation.id);

    console.log(_user_messages2.default.uninstall.complete());
  } catch (err) {
    await (0, _errorHandler.handleError)(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvdW5pbnN0YWxsLmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJsb2NhbEV4dGVuc2lvbnMiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwiYXBwIiwiYWxpYXMiLCJyZXF1aXJlc0FyZyIsImRlbWFuZCIsInVzYWdlIiwiYXJncyIsImFwcElkIiwiY2Fub25pY2FsTmFtZSIsImdldEV4dGVuc2lvbkNhbm9uaWNhbE5hbWUiLCJleHRlbnNpb25JZCIsIkVycm9yIiwibXNnIiwidW5pbnN0YWxsIiwibWlzc2luZ0V4dGVuc2lvbiIsImluc3RhbGxhdGlvbnMiLCJpbnN0YWxsYXRpb24iLCJmaWx0ZXIiLCJpbnN0IiwiZXh0ZW5zaW9uIiwibWlzc2luZ0luc3RhbGxhdGlvbiIsImlkIiwiY29uc29sZSIsImxvZyIsImNvbXBsZXRlIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFxQnNCQSxPLEdBQUFBLE87O0FBckJ0Qjs7QUFDQTs7SUFBWUMsZTs7QUFDWjs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxNQUFNQyxvQ0FBZSwwQ0FBckI7QUFDQSxNQUFNQyw0QkFBVSxXQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxTQUFLO0FBQ0hDLGFBQU8sR0FESjtBQUVETixtQkFBYSx1Q0FGWjtBQUdETyxtQkFBYSxJQUhaO0FBSURDLGNBQVE7QUFKUDtBQURFLEdBREosRUFTSkMsS0FUSSxDQVNHLFdBQVVSLE9BQVEsaUJBQWdCRCxXQUFZLEVBVGpELENBQVA7QUFVRCxDQVhNOztBQWFBLGVBQWVGLE9BQWYsQ0FBdUJZLElBQXZCLEVBQTZCO0FBQ2xDLFFBQU1DLFFBQVFELEtBQUtMLEdBQW5COztBQUVBLE1BQUk7QUFDRixVQUFNTyxnQkFBZ0IsTUFBTWIsZ0JBQWdCYyx5QkFBaEIsRUFBNUI7QUFDQSxVQUFNQyxjQUFjLE1BQU0sc0NBQWVGLGFBQWYsQ0FBMUI7O0FBRUEsUUFBSSxDQUFDRSxXQUFMLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSUMsS0FBSixDQUFVQyx3QkFBSUMsU0FBSixDQUFjQyxnQkFBZCxFQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNQyxnQkFBaUIsTUFBTSxxQ0FBb0JSLEtBQXBCLENBQTdCO0FBQ0EsVUFBTVMsZUFBZUQsY0FBY0UsTUFBZCxDQUFxQkMsUUFBUUEsS0FBS0MsU0FBTCxLQUFtQlQsV0FBaEQsRUFBNkQsQ0FBN0QsQ0FBckI7O0FBRUEsUUFBSSxDQUFDTSxZQUFMLEVBQW1CO0FBQ2pCLFlBQU0sSUFBSUwsS0FBSixDQUFVQyx3QkFBSUMsU0FBSixDQUFjTyxtQkFBZCxFQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNLG9DQUFtQmIsS0FBbkIsRUFBMEJTLGFBQWFLLEVBQXZDLENBQU47O0FBRUFDLFlBQVFDLEdBQVIsQ0FBWVgsd0JBQUlDLFNBQUosQ0FBY1csUUFBZCxFQUFaO0FBQ0QsR0FsQkQsQ0FrQkUsT0FBT0MsR0FBUCxFQUFZO0FBQ1osVUFBTSwrQkFBWUEsR0FBWixDQUFOO0FBQ0Q7QUFDRiIsImZpbGUiOiJ1bmluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmluc3RhbGxFeHRlbnNpb24sIGdldEV4dEluc3RhbGxhdGlvbnMgfSBmcm9tICcuLi9jbGllbnRzL2FwcC1tYW5hZ2VyJztcclxuaW1wb3J0ICogYXMgbG9jYWxFeHRlbnNpb25zIGZyb20gJy4uL2NsaWVudHMvbG9jYWwtZXh0ZW5zaW9ucyc7XHJcbmltcG9ydCB7IGdldEV4dGVuc2lvbklkIH0gZnJvbSAnLi4vY2xpZW50cy9leHRlbnNpb24tbWFuYWdlcic7XHJcbmltcG9ydCBtc2cgZnJvbSAnLi4vdXNlcl9tZXNzYWdlcyc7XHJcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSBgVW5pbnN0YWxsIGN1cnJlbnQgZXh0ZW5zaW9uIGZyb20gYW4gYXBwLmA7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ3VuaW5zdGFsbCc7XHJcbmV4cG9ydCBjb25zdCBidWlsZGVyID0geWFyZ3MgPT4ge1xyXG4gIHJldHVybiB5YXJnc1xyXG4gICAgLm9wdGlvbnMoe1xyXG4gICAgICBhcHA6IHtcclxuICAgICAgICBhbGlhczogJ2EnLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICd1bmluc3RhbGwgbG9jYWwgZXh0ZW5zaW9uIGZyb20gYW4gYXBwJyxcclxuICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxyXG4gICAgICAgICAgZGVtYW5kOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoYXJncykge1xyXG4gIGNvbnN0IGFwcElkID0gYXJncy5hcHA7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjYW5vbmljYWxOYW1lID0gYXdhaXQgbG9jYWxFeHRlbnNpb25zLmdldEV4dGVuc2lvbkNhbm9uaWNhbE5hbWUoKTtcclxuICAgIGNvbnN0IGV4dGVuc2lvbklkID0gYXdhaXQgZ2V0RXh0ZW5zaW9uSWQoY2Fub25pY2FsTmFtZSk7XHJcblxyXG4gICAgaWYgKCFleHRlbnNpb25JZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnLnVuaW5zdGFsbC5taXNzaW5nRXh0ZW5zaW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnMgPSAoYXdhaXQgZ2V0RXh0SW5zdGFsbGF0aW9ucyhhcHBJZCkpO1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uID0gaW5zdGFsbGF0aW9ucy5maWx0ZXIoaW5zdCA9PiBpbnN0LmV4dGVuc2lvbiA9PT0gZXh0ZW5zaW9uSWQpWzBdO1xyXG5cclxuICAgIGlmICghaW5zdGFsbGF0aW9uKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cudW5pbnN0YWxsLm1pc3NpbmdJbnN0YWxsYXRpb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgdW5pbnN0YWxsRXh0ZW5zaW9uKGFwcElkLCBpbnN0YWxsYXRpb24uaWQpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKG1zZy51bmluc3RhbGwuY29tcGxldGUoKSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBhd2FpdCBoYW5kbGVFcnJvcihlcnIpO1xyXG4gIH1cclxufVxyXG4iXX0=