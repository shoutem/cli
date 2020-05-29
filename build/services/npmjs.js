'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepoData = getRepoData;
exports.getVersion = getVersion;
exports.isLatest = isLatest;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _cache = require('./cache');

var cache = _interopRequireWildcard(_cache);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getRepoData(npmUrl) {
  return await (0, _requestPromiseNative2.default)({ uri: npmUrl, json: true });
}

async function getNpmjsVersion(npmUrl, tag) {
  const repo = await getRepoData(npmUrl);

  return repo['dist-tags'][tag];
}

async function getVersion(npmUrl, tag) {
  return await cache.get({ npmUrl, tag }, 3600 * 48, () => getNpmjsVersion(npmUrl, tag));
}

async function isLatest(npmUrl, currentVersion) {
  try {
    const latestVersion = await getVersion(npmUrl, 'latest');
    return _semver2.default.gte(currentVersion, latestVersion);
  } catch (err) {

    // to allow usage of CLI if npmjs is down
    return true;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9ucG1qcy5qcyJdLCJuYW1lcyI6WyJnZXRSZXBvRGF0YSIsImdldFZlcnNpb24iLCJpc0xhdGVzdCIsImNhY2hlIiwibnBtVXJsIiwidXJpIiwianNvbiIsImdldE5wbWpzVmVyc2lvbiIsInRhZyIsInJlcG8iLCJnZXQiLCJjdXJyZW50VmVyc2lvbiIsImxhdGVzdFZlcnNpb24iLCJzZW12ZXIiLCJndGUiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7O1FBSXNCQSxXLEdBQUFBLFc7UUFVQUMsVSxHQUFBQSxVO1FBSUFDLFEsR0FBQUEsUTs7QUFsQnRCOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUMsSzs7Ozs7O0FBRUwsZUFBZUgsV0FBZixDQUEyQkksTUFBM0IsRUFBbUM7QUFDeEMsU0FBTyxNQUFNLG9DQUFRLEVBQUVDLEtBQUtELE1BQVAsRUFBZUUsTUFBTSxJQUFyQixFQUFSLENBQWI7QUFDRDs7QUFFRCxlQUFlQyxlQUFmLENBQStCSCxNQUEvQixFQUF1Q0ksR0FBdkMsRUFBNEM7QUFDMUMsUUFBTUMsT0FBTyxNQUFNVCxZQUFZSSxNQUFaLENBQW5COztBQUVBLFNBQU9LLEtBQUssV0FBTCxFQUFrQkQsR0FBbEIsQ0FBUDtBQUNEOztBQUVNLGVBQWVQLFVBQWYsQ0FBMEJHLE1BQTFCLEVBQWtDSSxHQUFsQyxFQUF1QztBQUM1QyxTQUFPLE1BQU1MLE1BQU1PLEdBQU4sQ0FBVSxFQUFFTixNQUFGLEVBQVVJLEdBQVYsRUFBVixFQUEyQixPQUFPLEVBQWxDLEVBQXNDLE1BQU1ELGdCQUFnQkgsTUFBaEIsRUFBd0JJLEdBQXhCLENBQTVDLENBQWI7QUFDRDs7QUFFTSxlQUFlTixRQUFmLENBQXdCRSxNQUF4QixFQUFnQ08sY0FBaEMsRUFBZ0Q7QUFDckQsTUFBSTtBQUNGLFVBQU1DLGdCQUFnQixNQUFNWCxXQUFXRyxNQUFYLEVBQW1CLFFBQW5CLENBQTVCO0FBQ0EsV0FBT1MsaUJBQU9DLEdBQVAsQ0FBV0gsY0FBWCxFQUEyQkMsYUFBM0IsQ0FBUDtBQUNELEdBSEQsQ0FHRSxPQUFPRyxHQUFQLEVBQVk7O0FBRVo7QUFDQSxXQUFPLElBQVA7QUFDRDtBQUNGIiwiZmlsZSI6Im5wbWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlLW5hdGl2ZSc7XHJcbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJztcclxuaW1wb3J0ICogYXMgY2FjaGUgZnJvbSAnLi9jYWNoZSc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UmVwb0RhdGEobnBtVXJsKSB7XHJcbiAgcmV0dXJuIGF3YWl0IHJlcXVlc3QoeyB1cmk6IG5wbVVybCwganNvbjogdHJ1ZSB9KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0TnBtanNWZXJzaW9uKG5wbVVybCwgdGFnKSB7XHJcbiAgY29uc3QgcmVwbyA9IGF3YWl0IGdldFJlcG9EYXRhKG5wbVVybCk7XHJcblxyXG4gIHJldHVybiByZXBvWydkaXN0LXRhZ3MnXVt0YWddO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VmVyc2lvbihucG1VcmwsIHRhZykge1xyXG4gIHJldHVybiBhd2FpdCBjYWNoZS5nZXQoeyBucG1VcmwsIHRhZyB9LCAzNjAwICogNDgsICgpID0+IGdldE5wbWpzVmVyc2lvbihucG1VcmwsIHRhZykpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNMYXRlc3QobnBtVXJsLCBjdXJyZW50VmVyc2lvbikge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBsYXRlc3RWZXJzaW9uID0gYXdhaXQgZ2V0VmVyc2lvbihucG1VcmwsICdsYXRlc3QnKTtcclxuICAgIHJldHVybiBzZW12ZXIuZ3RlKGN1cnJlbnRWZXJzaW9uLCBsYXRlc3RWZXJzaW9uKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuXHJcbiAgICAvLyB0byBhbGxvdyB1c2FnZSBvZiBDTEkgaWYgbnBtanMgaXMgZG93blxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==