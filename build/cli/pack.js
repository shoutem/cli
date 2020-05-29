'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _packer = require('../services/packer');

var _packer2 = _interopRequireDefault(_packer);

var _extension = require('../services/extension');

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Pack shoutem extensions for upload';
const command = exports.command = 'pack';
const builder = exports.builder = yargs => {
  return yargs.options({
    nobuild: {
      type: 'boolean',
      description: 'Pack the extension without building it.'
    }
  }).usage(`shoutem ${command} [options]\n\n${description}`);
};
async function handler(args) {
  const extensionDir = await (0, _extension.ensureInExtensionDir)();

  try {
    const result = await (0, _packer2.default)(extensionDir, args);
    console.log(result.package);
  } catch (err) {
    await (0, _errorHandler.handleError)(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcGFjay5qcyJdLCJuYW1lcyI6WyJoYW5kbGVyIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiYnVpbGRlciIsInlhcmdzIiwib3B0aW9ucyIsIm5vYnVpbGQiLCJ0eXBlIiwidXNhZ2UiLCJhcmdzIiwiZXh0ZW5zaW9uRGlyIiwicmVzdWx0IiwiY29uc29sZSIsImxvZyIsInBhY2thZ2UiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7OztRQWdCc0JBLE8sR0FBQUEsTzs7QUFoQnRCOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxNQUFNQyxvQ0FBYyxvQ0FBcEI7QUFDQSxNQUFNQyw0QkFBVSxNQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxhQUFTO0FBQ1BDLFlBQU0sU0FEQztBQUVMTixtQkFBYTtBQUZSO0FBREYsR0FESixFQU9KTyxLQVBJLENBT0csV0FBVU4sT0FBUSxpQkFBZ0JELFdBQVksRUFQakQsQ0FBUDtBQVFELENBVE07QUFVQSxlQUFlRCxPQUFmLENBQXVCUyxJQUF2QixFQUE2QjtBQUNsQyxRQUFNQyxlQUFlLE1BQU0sc0NBQTNCOztBQUVBLE1BQUk7QUFDRixVQUFNQyxTQUFTLE1BQU0sc0JBQVlELFlBQVosRUFBMEJELElBQTFCLENBQXJCO0FBQ0FHLFlBQVFDLEdBQVIsQ0FBWUYsT0FBT0csT0FBbkI7QUFDRCxHQUhELENBR0UsT0FBTUMsR0FBTixFQUFXO0FBQ1gsVUFBTSwrQkFBWUEsR0FBWixDQUFOO0FBQ0Q7QUFDRiIsImZpbGUiOiJwYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNob3V0ZW1QYWNrIGZyb20gJy4uL3NlcnZpY2VzL3BhY2tlcic7XHJcbmltcG9ydCB7IGVuc3VyZUluRXh0ZW5zaW9uRGlyIH0gZnJvbSAnLi4vc2VydmljZXMvZXh0ZW5zaW9uJztcclxuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdQYWNrIHNob3V0ZW0gZXh0ZW5zaW9ucyBmb3IgdXBsb2FkJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAncGFjayc7XHJcbmV4cG9ydCBjb25zdCBidWlsZGVyID0geWFyZ3MgPT4ge1xyXG4gIHJldHVybiB5YXJnc1xyXG4gICAgLm9wdGlvbnMoe1xyXG4gICAgICBub2J1aWxkOiB7XHJcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdQYWNrIHRoZSBleHRlbnNpb24gd2l0aG91dCBidWlsZGluZyBpdC4nXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG59O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihhcmdzKSB7XHJcbiAgY29uc3QgZXh0ZW5zaW9uRGlyID0gYXdhaXQgZW5zdXJlSW5FeHRlbnNpb25EaXIoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNob3V0ZW1QYWNrKGV4dGVuc2lvbkRpciwgYXJncyk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQucGFja2FnZSk7XHJcbiAgfSBjYXRjaChlcnIpIHtcclxuICAgIGF3YWl0IGhhbmRsZUVycm9yKGVycik7XHJcbiAgfVxyXG59XHJcbiJdfQ==