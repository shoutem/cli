'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _errorHandler = require('../services/error-handler');

var _clone = require('../commands/clone');

const description = exports.description = 'Downloads a shoutem application with all it\'s extensions';
const command = exports.command = 'clone [appId]';
const builder = exports.builder = yargs => {
  return yargs.options({
    platform: {

      alias: 'p',
      description: 'use external mobile app (ignores platform settings)',
      requiresArg: true
    },
    noconfigure: {
      description: 'skip platform configuration step',
      type: 'boolean'
    },
    dir: {
      description: 'directory name for the cloned app',
      requiresArg: true
    },
    force: {
      alias: 'f',
      description: 'destroys destination directory if it already exists',
      type: 'boolean'
    }
  }).usage(`shoutem ${command} \n\n${description}`);
};

async function handler(args) {
  await (0, _errorHandler.executeAndHandleError)(() => (0, _clone.clone)(args, process.cwd()));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY2xvbmUuanMiXSwibmFtZXMiOlsiaGFuZGxlciIsImRlc2NyaXB0aW9uIiwiY29tbWFuZCIsImJ1aWxkZXIiLCJ5YXJncyIsIm9wdGlvbnMiLCJwbGF0Zm9ybSIsImFsaWFzIiwicmVxdWlyZXNBcmciLCJub2NvbmZpZ3VyZSIsInR5cGUiLCJkaXIiLCJmb3JjZSIsInVzYWdlIiwiYXJncyIsInByb2Nlc3MiLCJjd2QiXSwibWFwcGluZ3MiOiI7Ozs7OztRQStCc0JBLE8sR0FBQUEsTzs7QUEvQnRCOztBQUNBOztBQUVPLE1BQU1DLG9DQUFjLDJEQUFwQjtBQUNBLE1BQU1DLDRCQUFVLGVBQWhCO0FBQ0EsTUFBTUMsNEJBQVVDLFNBQVM7QUFDOUIsU0FBT0EsTUFDSkMsT0FESSxDQUNJO0FBQ1BDLGNBQVU7O0FBRVJDLGFBQU8sR0FGQztBQUdSTixtQkFBYSxxREFITDtBQUlSTyxtQkFBYTtBQUpMLEtBREg7QUFPUEMsaUJBQWE7QUFDWFIsbUJBQWEsa0NBREY7QUFFWFMsWUFBTTtBQUZLLEtBUE47QUFXUEMsU0FBSztBQUNIVixtQkFBYSxtQ0FEVjtBQUVITyxtQkFBYTtBQUZWLEtBWEU7QUFlUEksV0FBTztBQUNMTCxhQUFPLEdBREY7QUFFTE4sbUJBQWEscURBRlI7QUFHTFMsWUFBTTtBQUhEO0FBZkEsR0FESixFQXNCSkcsS0F0QkksQ0FzQkcsV0FBVVgsT0FBUSxRQUFPRCxXQUFZLEVBdEJ4QyxDQUFQO0FBdUJELENBeEJNOztBQTBCQSxlQUFlRCxPQUFmLENBQXVCYyxJQUF2QixFQUE2QjtBQUNsQyxRQUFNLHlDQUFzQixNQUFNLGtCQUFNQSxJQUFOLEVBQVlDLFFBQVFDLEdBQVIsRUFBWixDQUE1QixDQUFOO0FBQ0QiLCJmaWxlIjoiY2xvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjdXRlQW5kSGFuZGxlRXJyb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcclxuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICcuLi9jb21tYW5kcy9jbG9uZSc7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnRG93bmxvYWRzIGEgc2hvdXRlbSBhcHBsaWNhdGlvbiB3aXRoIGFsbCBpdFxcJ3MgZXh0ZW5zaW9ucyc7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ2Nsb25lIFthcHBJZF0nO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHtcclxuICByZXR1cm4geWFyZ3NcclxuICAgIC5vcHRpb25zKHtcclxuICAgICAgcGxhdGZvcm06IHtcclxuXHJcbiAgICAgICAgYWxpYXM6ICdwJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ3VzZSBleHRlcm5hbCBtb2JpbGUgYXBwIChpZ25vcmVzIHBsYXRmb3JtIHNldHRpbmdzKScsXHJcbiAgICAgICAgcmVxdWlyZXNBcmc6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbm9jb25maWd1cmU6IHtcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ3NraXAgcGxhdGZvcm0gY29uZmlndXJhdGlvbiBzdGVwJyxcclxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgfSxcclxuICAgICAgZGlyOiB7XHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdkaXJlY3RvcnkgbmFtZSBmb3IgdGhlIGNsb25lZCBhcHAnLFxyXG4gICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvcmNlOiB7XHJcbiAgICAgICAgYWxpYXM6ICdmJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ2Rlc3Ryb3lzIGRlc3RpbmF0aW9uIGRpcmVjdG9yeSBpZiBpdCBhbHJlYWR5IGV4aXN0cycsXHJcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBcXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoYXJncykge1xyXG4gIGF3YWl0IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcigoKSA9PiBjbG9uZShhcmdzLCBwcm9jZXNzLmN3ZCgpKSk7XHJcbn1cclxuIl19