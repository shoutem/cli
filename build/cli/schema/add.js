'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.description = undefined;
exports.handler = handler;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _schema = require('../../commands/schema');

var _user_messages = require('../../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _cliParsing = require('../../services/cli-parsing');

var _errorHandler = require('../../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSchemaAsync = _bluebird2.default.promisify(_schema.createSchema);

const description = exports.description = 'Add schema to current extension';
const command = exports.command = 'add <name>';
async function handler(args) {
  try {
    (0, _cliParsing.ensureVariableName)(args.name);
    const path = await createSchemaAsync(args.name);
    console.log(_user_messages2.default.schema.add.complete(args.name, path));
  } catch (err) {
    await (0, _errorHandler.handleError)(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvc2NoZW1hL2FkZC5qcyJdLCJuYW1lcyI6WyJoYW5kbGVyIiwiY3JlYXRlU2NoZW1hQXN5bmMiLCJQcm9taXNlIiwicHJvbWlzaWZ5IiwiY3JlYXRlU2NoZW1hIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiYXJncyIsIm5hbWUiLCJwYXRoIiwiY29uc29sZSIsImxvZyIsIm1zZyIsInNjaGVtYSIsImFkZCIsImNvbXBsZXRlIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFVc0JBLE8sR0FBQUEsTzs7QUFWdEI7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUMsb0JBQW9CQyxtQkFBUUMsU0FBUixDQUFrQkMsb0JBQWxCLENBQTFCOztBQUVPLE1BQU1DLG9DQUFjLGlDQUFwQjtBQUNBLE1BQU1DLDRCQUFVLFlBQWhCO0FBQ0EsZUFBZU4sT0FBZixDQUF1Qk8sSUFBdkIsRUFBNkI7QUFDbEMsTUFBSTtBQUNGLHdDQUFtQkEsS0FBS0MsSUFBeEI7QUFDQSxVQUFNQyxPQUFPLE1BQU1SLGtCQUFrQk0sS0FBS0MsSUFBdkIsQ0FBbkI7QUFDQUUsWUFBUUMsR0FBUixDQUFZQyx3QkFBSUMsTUFBSixDQUFXQyxHQUFYLENBQWVDLFFBQWYsQ0FBd0JSLEtBQUtDLElBQTdCLEVBQW1DQyxJQUFuQyxDQUFaO0FBQ0QsR0FKRCxDQUlFLE9BQU9PLEdBQVAsRUFBWTtBQUNaLFVBQU0sK0JBQVlBLEdBQVosQ0FBTjtBQUNEO0FBQ0YiLCJmaWxlIjoiYWRkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xyXG5pbXBvcnQgeyBjcmVhdGVTY2hlbWEgfSBmcm9tICcuLi8uLi9jb21tYW5kcy9zY2hlbWEnO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uLy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbnN1cmVWYXJpYWJsZU5hbWUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jbGktcGFyc2luZyc7XHJcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcblxyXG5jb25zdCBjcmVhdGVTY2hlbWFBc3luYyA9IFByb21pc2UucHJvbWlzaWZ5KGNyZWF0ZVNjaGVtYSk7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnQWRkIHNjaGVtYSB0byBjdXJyZW50IGV4dGVuc2lvbic7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2FkZCA8bmFtZT4nO1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihhcmdzKSB7XHJcbiAgdHJ5IHtcclxuICAgIGVuc3VyZVZhcmlhYmxlTmFtZShhcmdzLm5hbWUpO1xyXG4gICAgY29uc3QgcGF0aCA9IGF3YWl0IGNyZWF0ZVNjaGVtYUFzeW5jKGFyZ3MubmFtZSk7XHJcbiAgICBjb25zb2xlLmxvZyhtc2cuc2NoZW1hLmFkZC5jb21wbGV0ZShhcmdzLm5hbWUsIHBhdGgpKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGF3YWl0IGhhbmRsZUVycm9yKGVycik7XHJcbiAgfVxyXG59XHJcbiJdfQ==