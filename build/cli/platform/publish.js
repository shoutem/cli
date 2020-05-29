'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.command = exports.description = undefined;
exports.publishOwnPlatform = publishOwnPlatform;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('colors');

var _spinner = require('../../services/spinner');

var _login = require('../../commands/login');

var _platformSelector = require('../../services/platform-selector');

var _platformSelector2 = _interopRequireDefault(_platformSelector);

var _platform = require('../../commands/platform');

var _extensionManager = require('../../clients/extension-manager');

var _errorHandler = require('../../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Publish a platform';
const command = exports.command = 'publish';
const builder = exports.builder = yargs => yargs.options({
  platform: {
    description: 'Id of platform to install',
    type: 'string',
    requiresArg: true,
    alias: 'p'
  }
}).usage(`shoutem ${command} [options]\n\n${description}`);

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(() => publishOwnPlatform(args));

async function publishOwnPlatform({ platform }) {
  const developer = await (0, _login.ensureUserIsLoggedIn)();

  const platformId = platform || (await (0, _platformSelector2.default)(_lodash2.default.filter((await (0, _platform.getAvailablePlatforms)()), { published: false })));

  await (0, _spinner.spinify)((0, _extensionManager.publishPlatform)(platformId));
  console.log('Success!'.green.bold);
  console.log('Your platform is now public!');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvcGxhdGZvcm0vcHVibGlzaC5qcyJdLCJuYW1lcyI6WyJwdWJsaXNoT3duUGxhdGZvcm0iLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwicGxhdGZvcm0iLCJ0eXBlIiwicmVxdWlyZXNBcmciLCJhbGlhcyIsInVzYWdlIiwiaGFuZGxlciIsImFyZ3MiLCJkZXZlbG9wZXIiLCJwbGF0Zm9ybUlkIiwiXyIsImZpbHRlciIsInB1Ymxpc2hlZCIsImNvbnNvbGUiLCJsb2ciLCJncmVlbiIsImJvbGQiXSwibWFwcGluZ3MiOiI7Ozs7OztRQXdCc0JBLGtCLEdBQUFBLGtCOztBQXhCdEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sTUFBTUMsb0NBQWMsb0JBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsU0FBaEI7QUFDQSxNQUFNQyw0QkFBVUMsU0FBU0EsTUFDN0JDLE9BRDZCLENBQ3JCO0FBQ1BDLFlBQVU7QUFDUkwsaUJBQWEsMkJBREw7QUFFUk0sVUFBTSxRQUZFO0FBR1JDLGlCQUFhLElBSEw7QUFJUkMsV0FBTztBQUpDO0FBREgsQ0FEcUIsRUFTN0JDLEtBVDZCLENBU3RCLFdBQVVSLE9BQVEsaUJBQWdCRCxXQUFZLEVBVHhCLENBQXpCOztBQVdBLE1BQU1VLDRCQUFVQyxRQUFRLHlDQUFzQixNQUFNWixtQkFBbUJZLElBQW5CLENBQTVCLENBQXhCOztBQUVBLGVBQWVaLGtCQUFmLENBQWtDLEVBQUVNLFFBQUYsRUFBbEMsRUFBZ0Q7QUFDckQsUUFBTU8sWUFBWSxNQUFNLGtDQUF4Qjs7QUFFQSxRQUFNQyxhQUFhUixhQUFZLE1BQU0sZ0NBQWVTLGlCQUFFQyxNQUFGLEVBQVMsTUFBTSxzQ0FBZixHQUF3QyxFQUFFQyxXQUFXLEtBQWIsRUFBeEMsQ0FBZixDQUFsQixDQUFuQjs7QUFFQSxRQUFNLHNCQUFRLHVDQUFnQkgsVUFBaEIsQ0FBUixDQUFOO0FBQ0FJLFVBQVFDLEdBQVIsQ0FBWSxXQUFXQyxLQUFYLENBQWlCQyxJQUE3QjtBQUNBSCxVQUFRQyxHQUFSLENBQVksOEJBQVo7QUFDRCIsImZpbGUiOiJwdWJsaXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICdjb2xvcnMnO1xyXG5pbXBvcnQgeyBzcGluaWZ5IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc3Bpbm5lcic7XHJcbmltcG9ydCB7IGVuc3VyZVVzZXJJc0xvZ2dlZEluIH0gZnJvbSAnLi4vLi4vY29tbWFuZHMvbG9naW4nO1xyXG5pbXBvcnQgc2VsZWN0UGxhdGZvcm0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxhdGZvcm0tc2VsZWN0b3InO1xyXG5pbXBvcnQgeyBnZXRBdmFpbGFibGVQbGF0Zm9ybXMgfSBmcm9tICcuLi8uLi9jb21tYW5kcy9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHB1Ymxpc2hQbGF0Zm9ybSB9IGZyb20gJy4uLy4uL2NsaWVudHMvZXh0ZW5zaW9uLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBleGVjdXRlQW5kSGFuZGxlRXJyb3IgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdQdWJsaXNoIGEgcGxhdGZvcm0nO1xyXG5leHBvcnQgY29uc3QgY29tbWFuZCA9ICdwdWJsaXNoJztcclxuZXhwb3J0IGNvbnN0IGJ1aWxkZXIgPSB5YXJncyA9PiB5YXJnc1xyXG4gIC5vcHRpb25zKHtcclxuICAgIHBsYXRmb3JtOiB7XHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWQgb2YgcGxhdGZvcm0gdG8gaW5zdGFsbCcsXHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcclxuICAgICAgYWxpYXM6ICdwJyxcclxuICAgIH0sXHJcbiAgfSlcclxuICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhcmdzID0+IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcigoKSA9PiBwdWJsaXNoT3duUGxhdGZvcm0oYXJncykpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1Ymxpc2hPd25QbGF0Zm9ybSh7IHBsYXRmb3JtIH0pIHtcclxuICBjb25zdCBkZXZlbG9wZXIgPSBhd2FpdCBlbnN1cmVVc2VySXNMb2dnZWRJbigpO1xyXG5cclxuICBjb25zdCBwbGF0Zm9ybUlkID0gcGxhdGZvcm0gfHwgYXdhaXQgc2VsZWN0UGxhdGZvcm0oXy5maWx0ZXIoYXdhaXQgZ2V0QXZhaWxhYmxlUGxhdGZvcm1zKCksIHsgcHVibGlzaGVkOiBmYWxzZSB9KSk7XHJcblxyXG4gIGF3YWl0IHNwaW5pZnkocHVibGlzaFBsYXRmb3JtKHBsYXRmb3JtSWQpKTtcclxuICBjb25zb2xlLmxvZygnU3VjY2VzcyEnLmdyZWVuLmJvbGQpO1xyXG4gIGNvbnNvbGUubG9nKCdZb3VyIHBsYXRmb3JtIGlzIG5vdyBwdWJsaWMhJyk7XHJcbn1cclxuIl19