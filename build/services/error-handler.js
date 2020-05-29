'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessage = getErrorMessage;
exports.handleError = handleError;
exports.executeAndHandleError = executeAndHandleError;

require('colors');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _cacheEnv = require('./cache-env');

var cache = _interopRequireWildcard(_cacheEnv);

var _spinner = require('./spinner');

var spinner = _interopRequireWildcard(_spinner);

require('exit-code');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getJsonApiErrorMessage(errors) {
  const generalDetail = _lodash2.default.upperFirst(_lodash2.default.get(errors, '[0].detail') || _lodash2.default.get(errors, '[0].title'));
  const specificDetail = _lodash2.default.upperFirst(_lodash2.default.get(errors, '[0].meta.trace.detail'));

  if (generalDetail && specificDetail && generalDetail !== specificDetail) {
    return `${generalDetail} (${specificDetail})`;
  }

  return specificDetail || generalDetail || '';
}

function getErrorMessage(err) {
  if (!err) {
    return '';
  }

  if (err.message) {
    return err.message;
  }

  if (err.statusCode === 401 || err.statusCode === 403) {
    return 'Access denied, use `shoutem login` command to login';
  }

  if (_lodash2.default.get(err, 'body.errors')) {
    return getJsonApiErrorMessage(err.body.errors);
  }

  if (typeof _lodash2.default.get(err, 'response.body') === 'string') {
    try {
      const body = JSON.parse(_lodash2.default.get(err, 'response.body'));
      if (body.errors) {
        return getJsonApiErrorMessage(body.errors);
      }
    } catch (err) {}
  }

  return 'Unrecognized error. Run `shoutem last-error` for more additional details';
}

let reportInfoPrinted = false;

async function handleError(err) {
  try {
    if (err) {
      process.exitCode = err.code || -1;
    }
    spinner.stopAll();
    console.error(getErrorMessage(err).red.bold);

    const errorJson = JSON.parse((0, _jsonStringifySafe2.default)(err));
    errorJson.stack = (err || {}).stack;
    errorJson.message = (err || {}).message;
    await cache.setValue('last-error', errorJson);
    if (!reportInfoPrinted) {
      console.error(`\nUse ${'shoutem last-error'.cyan} for more info`);
      reportInfoPrinted = true;
    }
  } catch (err) {
    console.log(err);
  }
}

async function executeAndHandleError(func) {
  try {
    await func();
  } catch (err) {
    await handleError(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImdldEVycm9yTWVzc2FnZSIsImhhbmRsZUVycm9yIiwiZXhlY3V0ZUFuZEhhbmRsZUVycm9yIiwiY2FjaGUiLCJzcGlubmVyIiwiZ2V0SnNvbkFwaUVycm9yTWVzc2FnZSIsImVycm9ycyIsImdlbmVyYWxEZXRhaWwiLCJfIiwidXBwZXJGaXJzdCIsImdldCIsInNwZWNpZmljRGV0YWlsIiwiZXJyIiwibWVzc2FnZSIsInN0YXR1c0NvZGUiLCJib2R5IiwiSlNPTiIsInBhcnNlIiwicmVwb3J0SW5mb1ByaW50ZWQiLCJwcm9jZXNzIiwiZXhpdENvZGUiLCJjb2RlIiwic3RvcEFsbCIsImNvbnNvbGUiLCJlcnJvciIsInJlZCIsImJvbGQiLCJlcnJvckpzb24iLCJzdGFjayIsInNldFZhbHVlIiwiY3lhbiIsImxvZyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBa0JnQkEsZSxHQUFBQSxlO1FBaUNNQyxXLEdBQUFBLFc7UUFxQkFDLHFCLEdBQUFBLHFCOztBQXhFdEI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQyxLOztBQUNaOztJQUFZQyxPOztBQUNaOzs7Ozs7QUFFQSxTQUFTQyxzQkFBVCxDQUFnQ0MsTUFBaEMsRUFBd0M7QUFDdEMsUUFBTUMsZ0JBQWdCQyxpQkFBRUMsVUFBRixDQUFhRCxpQkFBRUUsR0FBRixDQUFNSixNQUFOLEVBQWMsWUFBZCxLQUErQkUsaUJBQUVFLEdBQUYsQ0FBTUosTUFBTixFQUFjLFdBQWQsQ0FBNUMsQ0FBdEI7QUFDQSxRQUFNSyxpQkFBaUJILGlCQUFFQyxVQUFGLENBQWFELGlCQUFFRSxHQUFGLENBQU1KLE1BQU4sRUFBYyx1QkFBZCxDQUFiLENBQXZCOztBQUVBLE1BQUlDLGlCQUFpQkksY0FBakIsSUFBbUNKLGtCQUFrQkksY0FBekQsRUFBeUU7QUFDdkUsV0FBUSxHQUFFSixhQUFjLEtBQUlJLGNBQWUsR0FBM0M7QUFDRDs7QUFFRCxTQUFPQSxrQkFBa0JKLGFBQWxCLElBQW1DLEVBQTFDO0FBQ0Q7O0FBRU0sU0FBU1AsZUFBVCxDQUF5QlksR0FBekIsRUFBOEI7QUFDbkMsTUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDUixXQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFJQSxJQUFJQyxPQUFSLEVBQWlCO0FBQ2YsV0FBT0QsSUFBSUMsT0FBWDtBQUNEOztBQUVELE1BQUlELElBQUlFLFVBQUosS0FBbUIsR0FBbkIsSUFBMEJGLElBQUlFLFVBQUosS0FBbUIsR0FBakQsRUFBc0Q7QUFDcEQsV0FBTyxxREFBUDtBQUNEOztBQUVELE1BQUlOLGlCQUFFRSxHQUFGLENBQU1FLEdBQU4sRUFBVyxhQUFYLENBQUosRUFBK0I7QUFDN0IsV0FBT1AsdUJBQXVCTyxJQUFJRyxJQUFKLENBQVNULE1BQWhDLENBQVA7QUFDRDs7QUFFRCxNQUFJLE9BQU9FLGlCQUFFRSxHQUFGLENBQU1FLEdBQU4sRUFBVyxlQUFYLENBQVAsS0FBd0MsUUFBNUMsRUFBc0Q7QUFDcEQsUUFBSTtBQUNGLFlBQU1HLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1QsaUJBQUVFLEdBQUYsQ0FBTUUsR0FBTixFQUFXLGVBQVgsQ0FBWCxDQUFiO0FBQ0EsVUFBSUcsS0FBS1QsTUFBVCxFQUFpQjtBQUNmLGVBQU9ELHVCQUF1QlUsS0FBS1QsTUFBNUIsQ0FBUDtBQUNEO0FBQ0YsS0FMRCxDQUtFLE9BQU9NLEdBQVAsRUFBVyxDQUNaO0FBQ0Y7O0FBR0QsU0FBTywwRUFBUDtBQUNEOztBQUVELElBQUlNLG9CQUFvQixLQUF4Qjs7QUFFTyxlQUFlakIsV0FBZixDQUEyQlcsR0FBM0IsRUFBZ0M7QUFDckMsTUFBSTtBQUNGLFFBQUlBLEdBQUosRUFBUztBQUNQTyxjQUFRQyxRQUFSLEdBQW1CUixJQUFJUyxJQUFKLElBQVksQ0FBQyxDQUFoQztBQUNEO0FBQ0NqQixZQUFRa0IsT0FBUjtBQUNBQyxZQUFRQyxLQUFSLENBQWN4QixnQkFBZ0JZLEdBQWhCLEVBQXFCYSxHQUFyQixDQUF5QkMsSUFBdkM7O0FBRUEsVUFBTUMsWUFBWVgsS0FBS0MsS0FBTCxDQUFXLGlDQUFVTCxHQUFWLENBQVgsQ0FBbEI7QUFDQWUsY0FBVUMsS0FBVixHQUFrQixDQUFDaEIsT0FBTyxFQUFSLEVBQVlnQixLQUE5QjtBQUNBRCxjQUFVZCxPQUFWLEdBQW9CLENBQUNELE9BQU8sRUFBUixFQUFZQyxPQUFoQztBQUNBLFVBQU1WLE1BQU0wQixRQUFOLENBQWUsWUFBZixFQUE2QkYsU0FBN0IsQ0FBTjtBQUNBLFFBQUksQ0FBQ1QsaUJBQUwsRUFBd0I7QUFDdEJLLGNBQVFDLEtBQVIsQ0FBZSxTQUFRLHFCQUFxQk0sSUFBSyxnQkFBakQ7QUFDQVosMEJBQW9CLElBQXBCO0FBQ0Q7QUFDSixHQWZELENBZUUsT0FBT04sR0FBUCxFQUFZO0FBQ1ZXLFlBQVFRLEdBQVIsQ0FBWW5CLEdBQVo7QUFDSDtBQUNGOztBQUVNLGVBQWVWLHFCQUFmLENBQXFDOEIsSUFBckMsRUFBMkM7QUFDaEQsTUFBSTtBQUNGLFVBQU1BLE1BQU47QUFDRCxHQUZELENBRUUsT0FBT3BCLEdBQVAsRUFBWTtBQUNaLFVBQU1YLFlBQVlXLEdBQVosQ0FBTjtBQUNEO0FBQ0YiLCJmaWxlIjoiZXJyb3ItaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnY29sb3JzJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcclxuaW1wb3J0ICogYXMgY2FjaGUgZnJvbSAnLi9jYWNoZS1lbnYnO1xyXG5pbXBvcnQgKiBhcyBzcGlubmVyIGZyb20gJy4vc3Bpbm5lcic7XHJcbmltcG9ydCAnZXhpdC1jb2RlJztcclxuXHJcbmZ1bmN0aW9uIGdldEpzb25BcGlFcnJvck1lc3NhZ2UoZXJyb3JzKSB7XHJcbiAgY29uc3QgZ2VuZXJhbERldGFpbCA9IF8udXBwZXJGaXJzdChfLmdldChlcnJvcnMsICdbMF0uZGV0YWlsJykgfHwgXy5nZXQoZXJyb3JzLCAnWzBdLnRpdGxlJykpO1xyXG4gIGNvbnN0IHNwZWNpZmljRGV0YWlsID0gXy51cHBlckZpcnN0KF8uZ2V0KGVycm9ycywgJ1swXS5tZXRhLnRyYWNlLmRldGFpbCcpKTtcclxuXHJcbiAgaWYgKGdlbmVyYWxEZXRhaWwgJiYgc3BlY2lmaWNEZXRhaWwgJiYgZ2VuZXJhbERldGFpbCAhPT0gc3BlY2lmaWNEZXRhaWwpIHtcclxuICAgIHJldHVybiBgJHtnZW5lcmFsRGV0YWlsfSAoJHtzcGVjaWZpY0RldGFpbH0pYDtcclxuICB9XHJcblxyXG4gIHJldHVybiBzcGVjaWZpY0RldGFpbCB8fCBnZW5lcmFsRGV0YWlsIHx8ICcnO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGVycikge1xyXG4gIGlmICghZXJyKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyLm1lc3NhZ2UpIHtcclxuICAgIHJldHVybiBlcnIubWVzc2FnZTtcclxuICB9XHJcblxyXG4gIGlmIChlcnIuc3RhdHVzQ29kZSA9PT0gNDAxIHx8IGVyci5zdGF0dXNDb2RlID09PSA0MDMpIHtcclxuICAgIHJldHVybiAnQWNjZXNzIGRlbmllZCwgdXNlIGBzaG91dGVtIGxvZ2luYCBjb21tYW5kIHRvIGxvZ2luJztcclxuICB9XHJcblxyXG4gIGlmIChfLmdldChlcnIsICdib2R5LmVycm9ycycpKSB7XHJcbiAgICByZXR1cm4gZ2V0SnNvbkFwaUVycm9yTWVzc2FnZShlcnIuYm9keS5lcnJvcnMpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZihfLmdldChlcnIsICdyZXNwb25zZS5ib2R5JykpID09PSAnc3RyaW5nJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UoXy5nZXQoZXJyLCAncmVzcG9uc2UuYm9keScpKTtcclxuICAgICAgaWYgKGJvZHkuZXJyb3JzKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldEpzb25BcGlFcnJvck1lc3NhZ2UoYm9keS5lcnJvcnMpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpe1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiAnVW5yZWNvZ25pemVkIGVycm9yLiBSdW4gYHNob3V0ZW0gbGFzdC1lcnJvcmAgZm9yIG1vcmUgYWRkaXRpb25hbCBkZXRhaWxzJ1xyXG59XHJcblxyXG5sZXQgcmVwb3J0SW5mb1ByaW50ZWQgPSBmYWxzZTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnIpIHtcclxuICB0cnkge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gZXJyLmNvZGUgfHwgLTE7XHJcbiAgICB9XHJcbiAgICAgIHNwaW5uZXIuc3RvcEFsbCgpO1xyXG4gICAgICBjb25zb2xlLmVycm9yKGdldEVycm9yTWVzc2FnZShlcnIpLnJlZC5ib2xkKTtcclxuXHJcbiAgICAgIGNvbnN0IGVycm9ySnNvbiA9IEpTT04ucGFyc2Uoc3RyaW5naWZ5KGVycikpO1xyXG4gICAgICBlcnJvckpzb24uc3RhY2sgPSAoZXJyIHx8IHt9KS5zdGFjaztcclxuICAgICAgZXJyb3JKc29uLm1lc3NhZ2UgPSAoZXJyIHx8IHt9KS5tZXNzYWdlO1xyXG4gICAgICBhd2FpdCBjYWNoZS5zZXRWYWx1ZSgnbGFzdC1lcnJvcicsIGVycm9ySnNvbik7XHJcbiAgICAgIGlmICghcmVwb3J0SW5mb1ByaW50ZWQpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGBcXG5Vc2UgJHsnc2hvdXRlbSBsYXN0LWVycm9yJy5jeWFufSBmb3IgbW9yZSBpbmZvYCk7XHJcbiAgICAgICAgcmVwb3J0SW5mb1ByaW50ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFuZEhhbmRsZUVycm9yKGZ1bmMpIHtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgZnVuYygpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgYXdhaXQgaGFuZGxlRXJyb3IoZXJyKTtcclxuICB9XHJcbn1cclxuIl19