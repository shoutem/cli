'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _login = require('../commands/login');

var _confirmer = require('../services/confirmer');

var _confirmer2 = _interopRequireDefault(_confirmer);

var _serverEnv = require('../clients/server-env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (msg) {
  const dev = await (0, _login.ensureUserIsLoggedIn)();

  if ((0, _serverEnv.getHostEnvName)() !== 'production' || dev.name !== 'shoutem') {
    return true;
  }

  return await (0, _confirmer2.default)(msg, { default: false });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25maXJtLWFkbWluLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJtc2ciLCJkZXYiLCJuYW1lIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztrQkFFZSxnQkFBZUEsR0FBZixFQUFvQjtBQUNqQyxRQUFNQyxNQUFNLE1BQU0sa0NBQWxCOztBQUVBLE1BQUkscUNBQXFCLFlBQXJCLElBQXFDQSxJQUFJQyxJQUFKLEtBQWEsU0FBdEQsRUFBaUU7QUFDL0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTyxNQUFNLHlCQUFRRixHQUFSLEVBQWEsRUFBRUcsU0FBUyxLQUFYLEVBQWIsQ0FBYjtBQUNELEMiLCJmaWxlIjoiY29uZmlybS1hZG1pbi1hY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlbnN1cmVVc2VySXNMb2dnZWRJbiB9IGZyb20gJy4uL2NvbW1hbmRzL2xvZ2luJztcclxuaW1wb3J0IGNvbmZpcm0gZnJvbSAnLi4vc2VydmljZXMvY29uZmlybWVyJztcclxuaW1wb3J0IHsgZ2V0SG9zdEVudk5hbWUgfSBmcm9tICcuLi9jbGllbnRzL3NlcnZlci1lbnYnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24obXNnKSB7XHJcbiAgY29uc3QgZGV2ID0gYXdhaXQgZW5zdXJlVXNlcklzTG9nZ2VkSW4oKTtcclxuXHJcbiAgaWYgKGdldEhvc3RFbnZOYW1lKCkgIT09ICdwcm9kdWN0aW9uJyB8fCBkZXYubmFtZSAhPT0gJ3Nob3V0ZW0nKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhd2FpdCBjb25maXJtKG1zZywgeyBkZWZhdWx0OiBmYWxzZSB9KTtcclxufVxyXG4iXX0=