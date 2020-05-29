'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExtensionCanonicalName = getExtensionCanonicalName;

var _extension = require('../services/extension');

var utils = _interopRequireWildcard(_extension);

var _login = require('../commands/login');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

async function getExtensionCanonicalName(extensionRoot = (0, _extension.ensureInExtensionDir)()) {
  const dev = await (0, _login.ensureUserIsLoggedIn)();
  const { name, version } = await utils.loadExtensionJson(extensionRoot);

  return utils.getExtensionCanonicalName(dev.name, name, version);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL2xvY2FsLWV4dGVuc2lvbnMuanMiXSwibmFtZXMiOlsiZ2V0RXh0ZW5zaW9uQ2Fub25pY2FsTmFtZSIsInV0aWxzIiwiZXh0ZW5zaW9uUm9vdCIsImRldiIsIm5hbWUiLCJ2ZXJzaW9uIiwibG9hZEV4dGVuc2lvbkpzb24iXSwibWFwcGluZ3MiOiI7Ozs7O1FBSXNCQSx5QixHQUFBQSx5Qjs7QUFKdEI7O0lBQVlDLEs7O0FBRVo7Ozs7QUFFTyxlQUFlRCx5QkFBZixDQUF5Q0UsZ0JBQWdCLHNDQUF6RCxFQUFpRjtBQUN0RixRQUFNQyxNQUFNLE1BQU0sa0NBQWxCO0FBQ0EsUUFBTSxFQUFFQyxJQUFGLEVBQVFDLE9BQVIsS0FBb0IsTUFBTUosTUFBTUssaUJBQU4sQ0FBd0JKLGFBQXhCLENBQWhDOztBQUVBLFNBQU9ELE1BQU1ELHlCQUFOLENBQWdDRyxJQUFJQyxJQUFwQyxFQUEwQ0EsSUFBMUMsRUFBZ0RDLE9BQWhELENBQVA7QUFDRCIsImZpbGUiOiJsb2NhbC1leHRlbnNpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi4vc2VydmljZXMvZXh0ZW5zaW9uJztcclxuaW1wb3J0IHsgZW5zdXJlSW5FeHRlbnNpb25EaXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9leHRlbnNpb24nO1xyXG5pbXBvcnQgeyBlbnN1cmVVc2VySXNMb2dnZWRJbiB9IGZyb20gJy4uL2NvbW1hbmRzL2xvZ2luJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFeHRlbnNpb25DYW5vbmljYWxOYW1lKGV4dGVuc2lvblJvb3QgPSBlbnN1cmVJbkV4dGVuc2lvbkRpcigpKSB7XHJcbiAgY29uc3QgZGV2ID0gYXdhaXQgZW5zdXJlVXNlcklzTG9nZ2VkSW4oKTtcclxuICBjb25zdCB7IG5hbWUsIHZlcnNpb24gfSA9IGF3YWl0IHV0aWxzLmxvYWRFeHRlbnNpb25Kc29uKGV4dGVuc2lvblJvb3QpO1xyXG5cclxuICByZXR1cm4gdXRpbHMuZ2V0RXh0ZW5zaW9uQ2Fub25pY2FsTmFtZShkZXYubmFtZSwgbmFtZSwgdmVyc2lvbik7XHJcbn1cclxuIl19