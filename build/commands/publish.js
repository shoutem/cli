'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.publishExtension = publishExtension;
exports.pushAndPublish = pushAndPublish;

var _extensionManager = require('../clients/extension-manager');

var extensionManager = _interopRequireWildcard(_extensionManager);

var _extension = require('../services/extension');

var utils = _interopRequireWildcard(_extension);

var _push = require('../commands/push');

var _localExtensions = require('../clients/local-extensions');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _spinner = require('../services/spinner');

var _platform = require('../services/platform');

var _publish = require('../cli/extension/publish');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

async function publishExtension(extDir) {
  const extJson = await utils.loadExtensionJson(extDir);
  const canonicalName = await (0, _localExtensions.getExtensionCanonicalName)(extDir);
  return await (0, _spinner.spinify)(extensionManager.publishExtension(canonicalName), _user_messages2.default.publish.publishInfo(extJson), 'OK');
}

async function pushAndPublish(args = {}) {
  if (!args.nopush) {
    await (0, _push.uploadExtension)(_extends({}, args, { publish: true }));
  }
  const extPath = (0, _extension.ensureInExtensionDir)();
  const { name } = await (0, _extension.loadExtensionJson)();
  const { id: extensionId, version } = await publishExtension(extPath);

  if (await (0, _platform.getPlatformRootDir)(extPath, { shouldThrow: false })) {
    await (0, _publish.offerInstallationUpdate)(extensionId, name, version);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wdWJsaXNoLmpzIl0sIm5hbWVzIjpbInB1Ymxpc2hFeHRlbnNpb24iLCJwdXNoQW5kUHVibGlzaCIsImV4dGVuc2lvbk1hbmFnZXIiLCJ1dGlscyIsImV4dERpciIsImV4dEpzb24iLCJsb2FkRXh0ZW5zaW9uSnNvbiIsImNhbm9uaWNhbE5hbWUiLCJtc2ciLCJwdWJsaXNoIiwicHVibGlzaEluZm8iLCJhcmdzIiwibm9wdXNoIiwiZXh0UGF0aCIsIm5hbWUiLCJpZCIsImV4dGVuc2lvbklkIiwidmVyc2lvbiIsInNob3VsZFRocm93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVdzQkEsZ0IsR0FBQUEsZ0I7UUFNQUMsYyxHQUFBQSxjOztBQWpCdEI7O0lBQVlDLGdCOztBQUNaOztJQUFZQyxLOztBQUNaOztBQUVBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUdPLGVBQWVILGdCQUFmLENBQWdDSSxNQUFoQyxFQUF3QztBQUM3QyxRQUFNQyxVQUFVLE1BQU1GLE1BQU1HLGlCQUFOLENBQXdCRixNQUF4QixDQUF0QjtBQUNBLFFBQU1HLGdCQUFnQixNQUFNLGdEQUEwQkgsTUFBMUIsQ0FBNUI7QUFDQSxTQUFPLE1BQU0sc0JBQVFGLGlCQUFpQkYsZ0JBQWpCLENBQWtDTyxhQUFsQyxDQUFSLEVBQTBEQyx3QkFBSUMsT0FBSixDQUFZQyxXQUFaLENBQXdCTCxPQUF4QixDQUExRCxFQUE0RixJQUE1RixDQUFiO0FBQ0Q7O0FBRU0sZUFBZUosY0FBZixDQUE4QlUsT0FBTyxFQUFyQyxFQUF5QztBQUM5QyxNQUFJLENBQUNBLEtBQUtDLE1BQVYsRUFBa0I7QUFDaEIsVUFBTSx3Q0FBcUJELElBQXJCLElBQTJCRixTQUFTLElBQXBDLElBQU47QUFDRDtBQUNELFFBQU1JLFVBQVUsc0NBQWhCO0FBQ0EsUUFBTSxFQUFFQyxJQUFGLEtBQVcsTUFBTSxtQ0FBdkI7QUFDQSxRQUFNLEVBQUVDLElBQUlDLFdBQU4sRUFBbUJDLE9BQW5CLEtBQStCLE1BQU1qQixpQkFBaUJhLE9BQWpCLENBQTNDOztBQUVBLE1BQUksTUFBTSxrQ0FBbUJBLE9BQW5CLEVBQTRCLEVBQUVLLGFBQWEsS0FBZixFQUE1QixDQUFWLEVBQStEO0FBQzdELFVBQU0sc0NBQXdCRixXQUF4QixFQUFxQ0YsSUFBckMsRUFBMkNHLE9BQTNDLENBQU47QUFDRDtBQUNGIiwiZmlsZSI6InB1Ymxpc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHRlbnNpb25NYW5hZ2VyIGZyb20gJy4uL2NsaWVudHMvZXh0ZW5zaW9uLW1hbmFnZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuLi9zZXJ2aWNlcy9leHRlbnNpb24nO1xyXG5pbXBvcnQgeyB1cGxvYWRFeHRlbnNpb24gfSBmcm9tICcuLi9jb21tYW5kcy9wdXNoJztcclxuaW1wb3J0IHsgZW5zdXJlSW5FeHRlbnNpb25EaXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9leHRlbnNpb24nO1xyXG5pbXBvcnQgeyBnZXRFeHRlbnNpb25DYW5vbmljYWxOYW1lIH0gZnJvbSAnLi4vY2xpZW50cy9sb2NhbC1leHRlbnNpb25zJztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IHtzcGluaWZ5fSBmcm9tIFwiLi4vc2VydmljZXMvc3Bpbm5lclwiO1xyXG5pbXBvcnQge2dldFBsYXRmb3JtUm9vdERpcn0gZnJvbSBcIi4uL3NlcnZpY2VzL3BsYXRmb3JtXCI7XHJcbmltcG9ydCB7b2ZmZXJJbnN0YWxsYXRpb25VcGRhdGV9IGZyb20gXCIuLi9jbGkvZXh0ZW5zaW9uL3B1Ymxpc2hcIjtcclxuaW1wb3J0IHtsb2FkRXh0ZW5zaW9uSnNvbn0gZnJvbSBcIi4uL3NlcnZpY2VzL2V4dGVuc2lvblwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1Ymxpc2hFeHRlbnNpb24oZXh0RGlyKSB7XHJcbiAgY29uc3QgZXh0SnNvbiA9IGF3YWl0IHV0aWxzLmxvYWRFeHRlbnNpb25Kc29uKGV4dERpcik7XHJcbiAgY29uc3QgY2Fub25pY2FsTmFtZSA9IGF3YWl0IGdldEV4dGVuc2lvbkNhbm9uaWNhbE5hbWUoZXh0RGlyKTtcclxuICByZXR1cm4gYXdhaXQgc3BpbmlmeShleHRlbnNpb25NYW5hZ2VyLnB1Ymxpc2hFeHRlbnNpb24oY2Fub25pY2FsTmFtZSksIG1zZy5wdWJsaXNoLnB1Ymxpc2hJbmZvKGV4dEpzb24pLCAnT0snKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1c2hBbmRQdWJsaXNoKGFyZ3MgPSB7fSkge1xyXG4gIGlmICghYXJncy5ub3B1c2gpIHtcclxuICAgIGF3YWl0IHVwbG9hZEV4dGVuc2lvbih7IC4uLmFyZ3MsIHB1Ymxpc2g6IHRydWUgfSk7XHJcbiAgfVxyXG4gIGNvbnN0IGV4dFBhdGggPSBlbnN1cmVJbkV4dGVuc2lvbkRpcigpO1xyXG4gIGNvbnN0IHsgbmFtZSB9ID0gYXdhaXQgbG9hZEV4dGVuc2lvbkpzb24oKTtcclxuICBjb25zdCB7IGlkOiBleHRlbnNpb25JZCwgdmVyc2lvbiB9ID0gYXdhaXQgcHVibGlzaEV4dGVuc2lvbihleHRQYXRoKTtcclxuXHJcbiAgaWYgKGF3YWl0IGdldFBsYXRmb3JtUm9vdERpcihleHRQYXRoLCB7IHNob3VsZFRocm93OiBmYWxzZSB9KSkge1xyXG4gICAgYXdhaXQgb2ZmZXJJbnN0YWxsYXRpb25VcGRhdGUoZXh0ZW5zaW9uSWQsIG5hbWUsIHZlcnNpb24pO1xyXG4gIH1cclxufVxyXG4iXX0=