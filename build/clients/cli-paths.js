'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalStoragePath = getLocalStoragePath;
exports.getLocalStoragePathSync = getLocalStoragePathSync;

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _mkdirp = require('mkdirp');

var _homeDir = require('../home-dir');

var _homeDir2 = _interopRequireDefault(_homeDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getLocalStoragePath() {
  const storagePath = (0, _homeDir2.default)();
  await (0, _mkdirpPromise2.default)(storagePath);
  return storagePath;
}

function getLocalStoragePathSync() {
  const storagePath = (0, _homeDir2.default)();
  (0, _mkdirp.sync)(storagePath);
  return storagePath;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL2NsaS1wYXRocy5qcyJdLCJuYW1lcyI6WyJnZXRMb2NhbFN0b3JhZ2VQYXRoIiwiZ2V0TG9jYWxTdG9yYWdlUGF0aFN5bmMiLCJzdG9yYWdlUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJc0JBLG1CLEdBQUFBLG1CO1FBTU5DLHVCLEdBQUFBLHVCOztBQVZoQjs7OztBQUNBOztBQUNBOzs7Ozs7QUFFTyxlQUFlRCxtQkFBZixHQUFxQztBQUMxQyxRQUFNRSxjQUFjLHdCQUFwQjtBQUNBLFFBQU0sNkJBQU9BLFdBQVAsQ0FBTjtBQUNBLFNBQU9BLFdBQVA7QUFDRDs7QUFFTSxTQUFTRCx1QkFBVCxHQUFtQztBQUN4QyxRQUFNQyxjQUFjLHdCQUFwQjtBQUNBLG9CQUFXQSxXQUFYO0FBQ0EsU0FBT0EsV0FBUDtBQUNEIiwiZmlsZSI6ImNsaS1wYXRocy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwLXByb21pc2UnO1xyXG5pbXBvcnQgeyBzeW5jIGFzIG1rZGlycFN5bmMgfSBmcm9tICdta2RpcnAnO1xyXG5pbXBvcnQgZ2V0SG9tZURpciBmcm9tICcuLi9ob21lLWRpcic7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlUGF0aCgpIHtcclxuICBjb25zdCBzdG9yYWdlUGF0aCA9IGdldEhvbWVEaXIoKTtcclxuICBhd2FpdCBta2RpcnAoc3RvcmFnZVBhdGgpO1xyXG4gIHJldHVybiBzdG9yYWdlUGF0aDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZVBhdGhTeW5jKCkge1xyXG4gIGNvbnN0IHN0b3JhZ2VQYXRoID0gZ2V0SG9tZURpcigpO1xyXG4gIG1rZGlycFN5bmMoc3RvcmFnZVBhdGgpO1xyXG4gIHJldHVybiBzdG9yYWdlUGF0aDtcclxufVxyXG4iXX0=