'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.description = undefined;
exports.handler = handler;

var _theme = require('../../commands/theme');

var _errorHandler = require('../../services/error-handler');

var _cliParsing = require('../../services/cli-parsing');

const description = exports.description = 'Add a theme to the current extension';
const command = exports.command = 'add <name>';
async function handler(args) {
  try {
    (0, _cliParsing.ensureVariableName)(args.name);
    await (0, _theme.createTheme)(args.name);
  } catch (error) {
    await (0, _errorHandler.handleError)(error);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvdGhlbWUvYWRkLmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJhcmdzIiwibmFtZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFNc0JBLE8sR0FBQUEsTzs7QUFOdEI7O0FBQ0E7O0FBQ0E7O0FBRU8sTUFBTUMsb0NBQWMsc0NBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsWUFBaEI7QUFDQSxlQUFlRixPQUFmLENBQXVCRyxJQUF2QixFQUE2QjtBQUNsQyxNQUFJO0FBQ0Ysd0NBQW1CQSxLQUFLQyxJQUF4QjtBQUNBLFVBQU0sd0JBQVlELEtBQUtDLElBQWpCLENBQU47QUFDRCxHQUhELENBR0UsT0FBT0MsS0FBUCxFQUFjO0FBQ2QsVUFBTSwrQkFBWUEsS0FBWixDQUFOO0FBQ0Q7QUFDRiIsImZpbGUiOiJhZGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVUaGVtZSB9IGZyb20gJy4uLy4uL2NvbW1hbmRzL3RoZW1lJztcclxuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuaW1wb3J0IHsgZW5zdXJlVmFyaWFibGVOYW1lIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2xpLXBhcnNpbmcnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0FkZCBhIHRoZW1lIHRvIHRoZSBjdXJyZW50IGV4dGVuc2lvbic7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2FkZCA8bmFtZT4nO1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihhcmdzKSB7XHJcbiAgdHJ5IHtcclxuICAgIGVuc3VyZVZhcmlhYmxlTmFtZShhcmdzLm5hbWUpO1xyXG4gICAgYXdhaXQgY3JlYXRlVGhlbWUoYXJncy5uYW1lKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgYXdhaXQgaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=