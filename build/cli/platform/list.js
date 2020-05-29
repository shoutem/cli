'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.command = exports.description = undefined;
exports.listPlatforms = listPlatforms;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('colors');

var _spinner = require('../../services/spinner');

var _login = require('../../commands/login');

var _platform = require('../../commands/platform');

var _errorHandler = require('../../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Lists available platforms';
const command = exports.command = 'list';
const builder = exports.builder = yargs => yargs.options({
  all: {
    description: 'Lists all available platforms',
    type: 'boolean',
    alias: 'a'
  }
}).usage(`shoutem ${command} [options]\n\n${description}`);

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(() => listPlatforms(args));

async function listPlatforms({ all }) {
  const developer = await (0, _login.ensureUserIsLoggedIn)();
  const platforms = await (0, _spinner.spinify)((0, _platform.getAvailablePlatforms)(all ? null : 20));

  console.log('\nID\t\t\t\tPublished\tAuthor@Version');

  _lodash2.default.forEach(platforms, platform => {
    const { id, published, version } = platform;
    const author = _lodash2.default.get(platform, ['author', 'name']);

    console.log(`${id}\t${published}\t\t${author}@${version}`);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvcGxhdGZvcm0vbGlzdC5qcyJdLCJuYW1lcyI6WyJsaXN0UGxhdGZvcm1zIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiYnVpbGRlciIsInlhcmdzIiwib3B0aW9ucyIsImFsbCIsInR5cGUiLCJhbGlhcyIsInVzYWdlIiwiaGFuZGxlciIsImFyZ3MiLCJkZXZlbG9wZXIiLCJwbGF0Zm9ybXMiLCJjb25zb2xlIiwibG9nIiwiXyIsImZvckVhY2giLCJwbGF0Zm9ybSIsImlkIiwicHVibGlzaGVkIiwidmVyc2lvbiIsImF1dGhvciIsImdldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBcUJzQkEsYSxHQUFBQSxhOztBQXJCdEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVPLE1BQU1DLG9DQUFjLDJCQUFwQjtBQUNBLE1BQU1DLDRCQUFVLE1BQWhCO0FBQ0EsTUFBTUMsNEJBQVVDLFNBQVNBLE1BQzdCQyxPQUQ2QixDQUNyQjtBQUNQQyxPQUFLO0FBQ0hMLGlCQUFhLCtCQURWO0FBRUhNLFVBQU0sU0FGSDtBQUdIQyxXQUFPO0FBSEo7QUFERSxDQURxQixFQVE3QkMsS0FSNkIsQ0FRdEIsV0FBVVAsT0FBUSxpQkFBZ0JELFdBQVksRUFSeEIsQ0FBekI7O0FBVUEsTUFBTVMsNEJBQVVDLFFBQVEseUNBQXNCLE1BQU1YLGNBQWNXLElBQWQsQ0FBNUIsQ0FBeEI7O0FBRUEsZUFBZVgsYUFBZixDQUE2QixFQUFFTSxHQUFGLEVBQTdCLEVBQXNDO0FBQzNDLFFBQU1NLFlBQVksTUFBTSxrQ0FBeEI7QUFDQSxRQUFNQyxZQUFZLE1BQU0sc0JBQVEscUNBQXNCUCxNQUFNLElBQU4sR0FBYSxFQUFuQyxDQUFSLENBQXhCOztBQUVBUSxVQUFRQyxHQUFSLENBQVksdUNBQVo7O0FBRUFDLG1CQUFFQyxPQUFGLENBQVVKLFNBQVYsRUFBc0JLLFFBQUQsSUFBYztBQUNqQyxVQUFNLEVBQUVDLEVBQUYsRUFBTUMsU0FBTixFQUFpQkMsT0FBakIsS0FBNkJILFFBQW5DO0FBQ0EsVUFBTUksU0FBU04saUJBQUVPLEdBQUYsQ0FBTUwsUUFBTixFQUFnQixDQUFDLFFBQUQsRUFBVyxNQUFYLENBQWhCLENBQWY7O0FBRUFKLFlBQVFDLEdBQVIsQ0FBYSxHQUFFSSxFQUFHLEtBQUlDLFNBQVUsT0FBTUUsTUFBTyxJQUFHRCxPQUFRLEVBQXhEO0FBQ0QsR0FMRDtBQU1EIiwiZmlsZSI6Imxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgJ2NvbG9ycyc7XHJcbmltcG9ydCB7IHNwaW5pZnkgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zcGlubmVyJztcclxuaW1wb3J0IHsgZW5zdXJlVXNlcklzTG9nZ2VkSW4gfSBmcm9tICcuLi8uLi9jb21tYW5kcy9sb2dpbic7XHJcbmltcG9ydCB7IGdldEF2YWlsYWJsZVBsYXRmb3JtcyB9IGZyb20gJy4uLy4uL2NvbW1hbmRzL3BsYXRmb3JtJztcclxuaW1wb3J0IHsgZXhlY3V0ZUFuZEhhbmRsZUVycm9yIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnTGlzdHMgYXZhaWxhYmxlIHBsYXRmb3Jtcyc7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2xpc3QnO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHlhcmdzXHJcbiAgLm9wdGlvbnMoe1xyXG4gICAgYWxsOiB7XHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdHMgYWxsIGF2YWlsYWJsZSBwbGF0Zm9ybXMnLFxyXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgIGFsaWFzOiAnYScsXHJcbiAgICB9LFxyXG4gIH0pXHJcbiAgLnVzYWdlKGBzaG91dGVtICR7Y29tbWFuZH0gW29wdGlvbnNdXFxuXFxuJHtkZXNjcmlwdGlvbn1gKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXJncyA9PiBleGVjdXRlQW5kSGFuZGxlRXJyb3IoKCkgPT4gbGlzdFBsYXRmb3JtcyhhcmdzKSk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzdFBsYXRmb3Jtcyh7IGFsbCB9KSB7XHJcbiAgY29uc3QgZGV2ZWxvcGVyID0gYXdhaXQgZW5zdXJlVXNlcklzTG9nZ2VkSW4oKTtcclxuICBjb25zdCBwbGF0Zm9ybXMgPSBhd2FpdCBzcGluaWZ5KGdldEF2YWlsYWJsZVBsYXRmb3JtcyhhbGwgPyBudWxsIDogMjApKTtcclxuXHJcbiAgY29uc29sZS5sb2coJ1xcbklEXFx0XFx0XFx0XFx0UHVibGlzaGVkXFx0QXV0aG9yQFZlcnNpb24nKTtcclxuXHJcbiAgXy5mb3JFYWNoKHBsYXRmb3JtcywgKHBsYXRmb3JtKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkLCBwdWJsaXNoZWQsIHZlcnNpb24gfSA9IHBsYXRmb3JtO1xyXG4gICAgY29uc3QgYXV0aG9yID0gXy5nZXQocGxhdGZvcm0sIFsnYXV0aG9yJywgJ25hbWUnXSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coYCR7aWR9XFx0JHtwdWJsaXNoZWR9XFx0XFx0JHthdXRob3J9QCR7dmVyc2lvbn1gKTtcclxuICB9KTtcclxufVxyXG4iXX0=