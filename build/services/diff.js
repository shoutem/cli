'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDiffLog = applyDiffLog;
exports.offerChanges = offerChanges;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _diff = require('diff');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _confirmer = require('./confirmer');

var _confirmer2 = _interopRequireDefault(_confirmer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function applyDiffLog(diffLog) {
  await Promise.all(_lodash2.default.map(diffLog, async (newValue, filePath) => {
    await (0, _mkdirpPromise2.default)(_path2.default.join(filePath, '..'));
    await _fsExtra2.default.writeFile(filePath, newValue, 'utf8');
  }));
}

function indentLinesWith(str, indent) {
  return str.split('\n').map(line => indent + line).join('\n');
}

async function offerChanges({ diffLog, postRunActions }) {
  const changes = await Promise.all(_lodash2.default.map(diffLog, async (fileContent, filePath) => {
    try {
      const oldContent = await _fsExtra2.default.readFile(filePath, 'utf8');
      if (oldContent === fileContent) {
        return { type: 'nochange', filePath };
      }
      return { diff: (0, _diff.diffLines)(oldContent, fileContent), type: 'modify', filePath };
    } catch (e) {
      return { type: 'add', filePath };
    }
  }));

  const sortedChanges = _lodash2.default.sortBy(changes, ['type', 'filePath']);

  sortedChanges.forEach(({ type, filePath, diff }) => {
    const localPath = _path2.default.relative(process.cwd(), filePath);
    if (type === 'nochange') {
      return;
    }

    if (type === 'add') {
      console.log(`${localPath} created`.green);
      return;
    }

    console.log(`${localPath} modified:`);
    diff.forEach(({ added, removed, value }, index) => {
      if (!value) {
        return;
      }
      if (added) {
        console.log(indentLinesWith(value, `  [+]  `).green);
      } else if (removed) {
        console.log(indentLinesWith(value, `  [-]  `).red);
      } else if (index > 0 && index < diff.length - 1) {
        console.log('  [ ]  ...');
      }
    });
  });

  await applyDiffLog(diffLog);
  await Promise.all(_lodash2.default.map(postRunActions, action => action()));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9kaWZmLmpzIl0sIm5hbWVzIjpbImFwcGx5RGlmZkxvZyIsIm9mZmVyQ2hhbmdlcyIsImRpZmZMb2ciLCJQcm9taXNlIiwiYWxsIiwiXyIsIm1hcCIsIm5ld1ZhbHVlIiwiZmlsZVBhdGgiLCJwYXRoIiwiam9pbiIsImZzIiwid3JpdGVGaWxlIiwiaW5kZW50TGluZXNXaXRoIiwic3RyIiwiaW5kZW50Iiwic3BsaXQiLCJsaW5lIiwicG9zdFJ1bkFjdGlvbnMiLCJjaGFuZ2VzIiwiZmlsZUNvbnRlbnQiLCJvbGRDb250ZW50IiwicmVhZEZpbGUiLCJ0eXBlIiwiZGlmZiIsImUiLCJzb3J0ZWRDaGFuZ2VzIiwic29ydEJ5IiwiZm9yRWFjaCIsImxvY2FsUGF0aCIsInJlbGF0aXZlIiwicHJvY2VzcyIsImN3ZCIsImNvbnNvbGUiLCJsb2ciLCJncmVlbiIsImFkZGVkIiwicmVtb3ZlZCIsInZhbHVlIiwiaW5kZXgiLCJyZWQiLCJsZW5ndGgiLCJhY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7O1FBT3NCQSxZLEdBQUFBLFk7UUFXQUMsWSxHQUFBQSxZOztBQWxCdEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sZUFBZUQsWUFBZixDQUE0QkUsT0FBNUIsRUFBcUM7QUFDMUMsUUFBTUMsUUFBUUMsR0FBUixDQUFZQyxpQkFBRUMsR0FBRixDQUFNSixPQUFOLEVBQWUsT0FBT0ssUUFBUCxFQUFpQkMsUUFBakIsS0FBOEI7QUFDN0QsVUFBTSw2QkFBT0MsZUFBS0MsSUFBTCxDQUFVRixRQUFWLEVBQW9CLElBQXBCLENBQVAsQ0FBTjtBQUNBLFVBQU1HLGtCQUFHQyxTQUFILENBQWFKLFFBQWIsRUFBdUJELFFBQXZCLEVBQWlDLE1BQWpDLENBQU47QUFDRCxHQUhpQixDQUFaLENBQU47QUFJRDs7QUFFRCxTQUFTTSxlQUFULENBQXlCQyxHQUF6QixFQUE4QkMsTUFBOUIsRUFBc0M7QUFDcEMsU0FBT0QsSUFBSUUsS0FBSixDQUFVLElBQVYsRUFBZ0JWLEdBQWhCLENBQW9CVyxRQUFRRixTQUFTRSxJQUFyQyxFQUEyQ1AsSUFBM0MsQ0FBZ0QsSUFBaEQsQ0FBUDtBQUNEOztBQUVNLGVBQWVULFlBQWYsQ0FBNEIsRUFBRUMsT0FBRixFQUFXZ0IsY0FBWCxFQUE1QixFQUF5RDtBQUM5RCxRQUFNQyxVQUFVLE1BQU1oQixRQUFRQyxHQUFSLENBQVlDLGlCQUFFQyxHQUFGLENBQU1KLE9BQU4sRUFBZSxPQUFPa0IsV0FBUCxFQUFvQlosUUFBcEIsS0FBaUM7QUFDaEYsUUFBSTtBQUNGLFlBQU1hLGFBQWEsTUFBTVYsa0JBQUdXLFFBQUgsQ0FBWWQsUUFBWixFQUFzQixNQUF0QixDQUF6QjtBQUNBLFVBQUlhLGVBQWVELFdBQW5CLEVBQWdDO0FBQzlCLGVBQU8sRUFBRUcsTUFBTSxVQUFSLEVBQW9CZixRQUFwQixFQUFQO0FBQ0Q7QUFDRCxhQUFPLEVBQUVnQixNQUFNLHFCQUFVSCxVQUFWLEVBQXNCRCxXQUF0QixDQUFSLEVBQTRDRyxNQUFNLFFBQWxELEVBQTREZixRQUE1RCxFQUFQO0FBQ0QsS0FORCxDQU1FLE9BQU9pQixDQUFQLEVBQVU7QUFDVixhQUFPLEVBQUVGLE1BQU0sS0FBUixFQUFlZixRQUFmLEVBQVA7QUFDRDtBQUNGLEdBVmlDLENBQVosQ0FBdEI7O0FBWUEsUUFBTWtCLGdCQUFnQnJCLGlCQUFFc0IsTUFBRixDQUFTUixPQUFULEVBQWtCLENBQUMsTUFBRCxFQUFTLFVBQVQsQ0FBbEIsQ0FBdEI7O0FBRUFPLGdCQUFjRSxPQUFkLENBQXNCLENBQUMsRUFBRUwsSUFBRixFQUFRZixRQUFSLEVBQWtCZ0IsSUFBbEIsRUFBRCxLQUE4QjtBQUNsRCxVQUFNSyxZQUFZcEIsZUFBS3FCLFFBQUwsQ0FBY0MsUUFBUUMsR0FBUixFQUFkLEVBQTZCeEIsUUFBN0IsQ0FBbEI7QUFDQSxRQUFJZSxTQUFTLFVBQWIsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxRQUFJQSxTQUFTLEtBQWIsRUFBb0I7QUFDbEJVLGNBQVFDLEdBQVIsQ0FBYSxHQUFFTCxTQUFVLFVBQWIsQ0FBdUJNLEtBQW5DO0FBQ0E7QUFDRDs7QUFFREYsWUFBUUMsR0FBUixDQUFhLEdBQUVMLFNBQVUsWUFBekI7QUFDQUwsU0FBS0ksT0FBTCxDQUFhLENBQUMsRUFBRVEsS0FBRixFQUFTQyxPQUFULEVBQWtCQyxLQUFsQixFQUFELEVBQTRCQyxLQUE1QixLQUFzQztBQUNqRCxVQUFJLENBQUNELEtBQUwsRUFBWTtBQUNWO0FBQ0Q7QUFDRCxVQUFJRixLQUFKLEVBQVc7QUFDVEgsZ0JBQVFDLEdBQVIsQ0FBWXJCLGdCQUFnQnlCLEtBQWhCLEVBQXdCLFNBQXhCLEVBQWtDSCxLQUE5QztBQUNELE9BRkQsTUFFTyxJQUFJRSxPQUFKLEVBQWE7QUFDbEJKLGdCQUFRQyxHQUFSLENBQVlyQixnQkFBZ0J5QixLQUFoQixFQUF3QixTQUF4QixFQUFrQ0UsR0FBOUM7QUFDRCxPQUZNLE1BRUEsSUFBSUQsUUFBUSxDQUFSLElBQWFBLFFBQVFmLEtBQUtpQixNQUFMLEdBQWMsQ0FBdkMsRUFBMEM7QUFDL0NSLGdCQUFRQyxHQUFSLENBQVksWUFBWjtBQUNEO0FBQ0YsS0FYRDtBQVlELEdBeEJEOztBQTBCQSxRQUFNbEMsYUFBYUUsT0FBYixDQUFOO0FBQ0EsUUFBTUMsUUFBUUMsR0FBUixDQUFZQyxpQkFBRUMsR0FBRixDQUFNWSxjQUFOLEVBQXNCd0IsVUFBVUEsUUFBaEMsQ0FBWixDQUFOO0FBQ0QiLCJmaWxlIjoiZGlmZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkaWZmTGluZXMgfSBmcm9tICdkaWZmJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAtcHJvbWlzZSc7XHJcbmltcG9ydCBjb25maXJtIGZyb20gJy4vY29uZmlybWVyJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhcHBseURpZmZMb2coZGlmZkxvZykge1xyXG4gIGF3YWl0IFByb21pc2UuYWxsKF8ubWFwKGRpZmZMb2csIGFzeW5jIChuZXdWYWx1ZSwgZmlsZVBhdGgpID0+IHtcclxuICAgIGF3YWl0IG1rZGlycChwYXRoLmpvaW4oZmlsZVBhdGgsICcuLicpKTtcclxuICAgIGF3YWl0IGZzLndyaXRlRmlsZShmaWxlUGF0aCwgbmV3VmFsdWUsICd1dGY4Jyk7XHJcbiAgfSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRlbnRMaW5lc1dpdGgoc3RyLCBpbmRlbnQpIHtcclxuICByZXR1cm4gc3RyLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiBpbmRlbnQgKyBsaW5lKS5qb2luKCdcXG4nKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9mZmVyQ2hhbmdlcyh7IGRpZmZMb2csIHBvc3RSdW5BY3Rpb25zIH0pIHtcclxuICBjb25zdCBjaGFuZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoXy5tYXAoZGlmZkxvZywgYXN5bmMgKGZpbGVDb250ZW50LCBmaWxlUGF0aCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgb2xkQ29udGVudCA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpO1xyXG4gICAgICBpZiAob2xkQ29udGVudCA9PT0gZmlsZUNvbnRlbnQpIHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnbm9jaGFuZ2UnLCBmaWxlUGF0aCB9O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7IGRpZmY6IGRpZmZMaW5lcyhvbGRDb250ZW50LCBmaWxlQ29udGVudCksIHR5cGU6ICdtb2RpZnknLCBmaWxlUGF0aCB9O1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4geyB0eXBlOiAnYWRkJywgZmlsZVBhdGggfTtcclxuICAgIH1cclxuICB9KSk7XHJcblxyXG4gIGNvbnN0IHNvcnRlZENoYW5nZXMgPSBfLnNvcnRCeShjaGFuZ2VzLCBbJ3R5cGUnLCAnZmlsZVBhdGgnXSk7XHJcblxyXG4gIHNvcnRlZENoYW5nZXMuZm9yRWFjaCgoeyB0eXBlLCBmaWxlUGF0aCwgZGlmZiB9KSA9PiB7XHJcbiAgICBjb25zdCBsb2NhbFBhdGggPSBwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGZpbGVQYXRoKTtcclxuICAgIGlmICh0eXBlID09PSAnbm9jaGFuZ2UnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgY29uc29sZS5sb2coYCR7bG9jYWxQYXRofSBjcmVhdGVkYC5ncmVlbik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhgJHtsb2NhbFBhdGh9IG1vZGlmaWVkOmApO1xyXG4gICAgZGlmZi5mb3JFYWNoKCh7IGFkZGVkLCByZW1vdmVkLCB2YWx1ZSB9LCBpbmRleCkgPT4ge1xyXG4gICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGluZGVudExpbmVzV2l0aCh2YWx1ZSwgYCAgWytdICBgKS5ncmVlbilcclxuICAgICAgfSBlbHNlIGlmIChyZW1vdmVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW5kZW50TGluZXNXaXRoKHZhbHVlLCBgICBbLV0gIGApLnJlZCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPiAwICYmIGluZGV4IDwgZGlmZi5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgWyBdICAuLi4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGF3YWl0IGFwcGx5RGlmZkxvZyhkaWZmTG9nKTtcclxuICBhd2FpdCBQcm9taXNlLmFsbChfLm1hcChwb3N0UnVuQWN0aW9ucywgYWN0aW9uID0+IGFjdGlvbigpKSk7XHJcbn1cclxuIl19