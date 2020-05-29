'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _forkTerminal = require('@shoutem/fork-terminal');

var _forkTerminal2 = _interopRequireDefault(_forkTerminal);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Run shoutem application on using Shoutem preview app';
const command = exports.command = 'run';
const builder = exports.builder = yargs => {
  return yargs.options({
    local: {
      alias: 'l',
      description: 'don\'t use tunneling for Shoutem app, connect directly to packager. Note: ' + 'this computer and iphone/android must be connected to the same network and port 8081 must be opened.',
      type: 'boolean'
    },
    small: {
      alias: 's',
      description: 'display smaller ASCII QR code which could be unreadable in some fonts',
      type: 'boolean'
    }
  }).usage(`shoutem ${command} [options]\n\n${description}`);
};
async function handler(args) {
  const nodeArgs = [_path2.default.join(__dirname, '..', 'scripts', 'shoutem-run.js'), '--local', !!args.local, '--small', !!args.small];

  (0, _forkTerminal2.default)('node', nodeArgs, { cwd: process.cwd() });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwibG9jYWwiLCJhbGlhcyIsInR5cGUiLCJzbWFsbCIsInVzYWdlIiwiYXJncyIsIm5vZGVBcmdzIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJjd2QiLCJwcm9jZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFzQnNCQSxPLEdBQUFBLE87O0FBdEJ0Qjs7OztBQUNBOzs7Ozs7QUFFTyxNQUFNQyxvQ0FBYyxzREFBcEI7QUFDQSxNQUFNQyw0QkFBVSxLQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxXQUFPO0FBQ0xDLGFBQU8sR0FERjtBQUVMTixtQkFBYSwrRUFDWCxzR0FIRztBQUlMTyxZQUFNO0FBSkQsS0FEQTtBQU9QQyxXQUFPO0FBQ0xGLGFBQU8sR0FERjtBQUVMTixtQkFBYSx1RUFGUjtBQUdMTyxZQUFNO0FBSEQ7QUFQQSxHQURKLEVBY0pFLEtBZEksQ0FjRyxXQUFVUixPQUFRLGlCQUFnQkQsV0FBWSxFQWRqRCxDQUFQO0FBZUQsQ0FoQk07QUFpQkEsZUFBZUQsT0FBZixDQUF1QlcsSUFBdkIsRUFBNkI7QUFDbEMsUUFBTUMsV0FBVyxDQUNmQyxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsU0FBM0IsRUFBc0MsZ0JBQXRDLENBRGUsRUFFZixTQUZlLEVBRUosQ0FBQyxDQUFDSixLQUFLTCxLQUZILEVBR2YsU0FIZSxFQUdKLENBQUMsQ0FBQ0ssS0FBS0YsS0FISCxDQUFqQjs7QUFNQSw4QkFBYSxNQUFiLEVBQXFCRyxRQUFyQixFQUErQixFQUFFSSxLQUFLQyxRQUFRRCxHQUFSLEVBQVAsRUFBL0I7QUFDRCIsImZpbGUiOiJydW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZm9ya1Rlcm1pbmFsIGZyb20gJ0BzaG91dGVtL2ZvcmstdGVybWluYWwnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdSdW4gc2hvdXRlbSBhcHBsaWNhdGlvbiBvbiB1c2luZyBTaG91dGVtIHByZXZpZXcgYXBwJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAncnVuJztcclxuZXhwb3J0IGNvbnN0IGJ1aWxkZXIgPSB5YXJncyA9PiB7XHJcbiAgcmV0dXJuIHlhcmdzXHJcbiAgICAub3B0aW9ucyh7XHJcbiAgICAgIGxvY2FsOiB7XHJcbiAgICAgICAgYWxpYXM6ICdsJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ2RvblxcJ3QgdXNlIHR1bm5lbGluZyBmb3IgU2hvdXRlbSBhcHAsIGNvbm5lY3QgZGlyZWN0bHkgdG8gcGFja2FnZXIuIE5vdGU6ICcgK1xyXG4gICAgICAgICAgJ3RoaXMgY29tcHV0ZXIgYW5kIGlwaG9uZS9hbmRyb2lkIG11c3QgYmUgY29ubmVjdGVkIHRvIHRoZSBzYW1lIG5ldHdvcmsgYW5kIHBvcnQgODA4MSBtdXN0IGJlIG9wZW5lZC4nLFxyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB9LFxyXG4gICAgICBzbWFsbDoge1xyXG4gICAgICAgIGFsaWFzOiAncycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdkaXNwbGF5IHNtYWxsZXIgQVNDSUkgUVIgY29kZSB3aGljaCBjb3VsZCBiZSB1bnJlYWRhYmxlIGluIHNvbWUgZm9udHMnLFxyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnVzYWdlKGBzaG91dGVtICR7Y29tbWFuZH0gW29wdGlvbnNdXFxuXFxuJHtkZXNjcmlwdGlvbn1gKTtcclxufTtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoYXJncykge1xyXG4gIGNvbnN0IG5vZGVBcmdzID0gW1xyXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3NjcmlwdHMnLCAnc2hvdXRlbS1ydW4uanMnKSxcclxuICAgICctLWxvY2FsJywgISFhcmdzLmxvY2FsLFxyXG4gICAgJy0tc21hbGwnLCAhIWFyZ3Muc21hbGxcclxuICBdO1xyXG5cclxuICBmb3JrVGVybWluYWwoJ25vZGUnLCBub2RlQXJncywgeyBjd2Q6IHByb2Nlc3MuY3dkKCkgfSlcclxufVxyXG4iXX0=