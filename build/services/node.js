'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containsBuildTask = containsBuildTask;
exports.buildNodeProject = buildNodeProject;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _npm = require('./npm');

var npm = _interopRequireWildcard(_npm);

var _childProcessPromise = require('child-process-promise');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function containsBuildTask(dir) {
  try {
    const pkgJson = await npm.getPackageJson(dir);
    return !!_lodash2.default.get(pkgJson, 'scripts.build');
  } catch (err) {
    return false;
  }
}

async function buildNodeProject(dir) {
  if (!(await containsBuildTask(dir))) {
    return false;
  }

  try {
    await (0, _childProcessPromise.exec)('npm install', { cwd: dir, FORCE_COLOR: true });
    await (0, _childProcessPromise.exec)('npm run build', { cwd: dir, FORCE_COLOR: true });
  } catch (err) {
    console.log(err.stdout);
    console.error(err.stderr);
    err.message = `${err.message + '\n'}Build failed for ${dir} directory.`;
    throw err;
  }
  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9ub2RlLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5zQnVpbGRUYXNrIiwiYnVpbGROb2RlUHJvamVjdCIsIm5wbSIsImRpciIsInBrZ0pzb24iLCJnZXRQYWNrYWdlSnNvbiIsIl8iLCJnZXQiLCJlcnIiLCJjd2QiLCJGT1JDRV9DT0xPUiIsImNvbnNvbGUiLCJsb2ciLCJzdGRvdXQiLCJlcnJvciIsInN0ZGVyciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBSXNCQSxpQixHQUFBQSxpQjtRQVNBQyxnQixHQUFBQSxnQjs7QUFidEI7Ozs7QUFDQTs7SUFBWUMsRzs7QUFDWjs7Ozs7O0FBRU8sZUFBZUYsaUJBQWYsQ0FBaUNHLEdBQWpDLEVBQXNDO0FBQzNDLE1BQUk7QUFDRixVQUFNQyxVQUFVLE1BQU1GLElBQUlHLGNBQUosQ0FBbUJGLEdBQW5CLENBQXRCO0FBQ0EsV0FBTyxDQUFDLENBQUNHLGlCQUFFQyxHQUFGLENBQU1ILE9BQU4sRUFBZSxlQUFmLENBQVQ7QUFDRCxHQUhELENBR0UsT0FBT0ksR0FBUCxFQUFZO0FBQ1osV0FBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFTSxlQUFlUCxnQkFBZixDQUFnQ0UsR0FBaEMsRUFBcUM7QUFDMUMsTUFBSSxFQUFDLE1BQU1ILGtCQUFrQkcsR0FBbEIsQ0FBUCxDQUFKLEVBQW1DO0FBQ2pDLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQUk7QUFDRixVQUFNLCtCQUFLLGFBQUwsRUFBb0IsRUFBRU0sS0FBS04sR0FBUCxFQUFZTyxhQUFhLElBQXpCLEVBQXBCLENBQU47QUFDQSxVQUFNLCtCQUFLLGVBQUwsRUFBc0IsRUFBRUQsS0FBS04sR0FBUCxFQUFZTyxhQUFhLElBQXpCLEVBQXRCLENBQU47QUFDRCxHQUhELENBR0UsT0FBT0YsR0FBUCxFQUFZO0FBQ1pHLFlBQVFDLEdBQVIsQ0FBWUosSUFBSUssTUFBaEI7QUFDQUYsWUFBUUcsS0FBUixDQUFjTixJQUFJTyxNQUFsQjtBQUNBUCxRQUFJUSxPQUFKLEdBQWUsR0FBRVIsSUFBSVEsT0FBSixHQUFjLElBQUssb0JBQW1CYixHQUFJLGFBQTNEO0FBQ0EsVUFBTUssR0FBTjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QiLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCAqIGFzIG5wbSBmcm9tIFwiLi9ucG1cIjtcclxuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkLXByb2Nlc3MtcHJvbWlzZSdcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb250YWluc0J1aWxkVGFzayhkaXIpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcGtnSnNvbiA9IGF3YWl0IG5wbS5nZXRQYWNrYWdlSnNvbihkaXIpO1xyXG4gICAgcmV0dXJuICEhXy5nZXQocGtnSnNvbiwgJ3NjcmlwdHMuYnVpbGQnKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZE5vZGVQcm9qZWN0KGRpcikge1xyXG4gIGlmICghYXdhaXQgY29udGFpbnNCdWlsZFRhc2soZGlyKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IGV4ZWMoJ25wbSBpbnN0YWxsJywgeyBjd2Q6IGRpciwgRk9SQ0VfQ09MT1I6IHRydWUgfSk7XHJcbiAgICBhd2FpdCBleGVjKCducG0gcnVuIGJ1aWxkJywgeyBjd2Q6IGRpciwgRk9SQ0VfQ09MT1I6IHRydWUgfSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIuc3Rkb3V0KTtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0ZGVycik7XHJcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vyci5tZXNzYWdlICsgJ1xcbid9QnVpbGQgZmFpbGVkIGZvciAke2Rpcn0gZGlyZWN0b3J5LmA7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbiJdfQ==