'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.description = undefined;
exports.builder = builder;

var _serverEnv = require('../clients/server-env');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _cacheEnv = require('../services/cache-env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = null;
const command = exports.command = 'use <server>';

const production = {
  command: 'production',
  description: 'Switch to shoutem live env',
  async handler() {
    await (0, _serverEnv.setHostEnvName)('production');
    console.log(_user_messages2.default.use.complete('production', (await (0, _cacheEnv.getValue)('developer'))));
  }
};

const dev = {
  command: 'dev',
  description: 'Switch to sauros dev env',
  async handler() {
    await (0, _serverEnv.setHostEnvName)('dev');
    console.log(_user_messages2.default.use.complete('dev', (await (0, _cacheEnv.getValue)('developer'))));
  }
};

const local = {
  command: 'local',
  description: 'Use api endpoints set in OS env variables',
  async handler() {
    await (0, _serverEnv.setHostEnvName)('local');
    console.log(_user_messages2.default.use.complete('local', (await (0, _cacheEnv.getValue)('developer'))));
  }
};

const qa = {
  command: 'qa',
  description: 'Switch to using sauros qa env',
  async handler() {
    await (0, _serverEnv.setHostEnvName)('qa');
    console.log(_user_messages2.default.use.complete('qa', (await (0, _cacheEnv.getValue)('developer'))));
  }
};

function builder(use) {
  return use.command(production).command(dev).command(local).command(qa).strict();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvdXNlLmpzIl0sIm5hbWVzIjpbImJ1aWxkZXIiLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJwcm9kdWN0aW9uIiwiaGFuZGxlciIsImNvbnNvbGUiLCJsb2ciLCJtc2ciLCJ1c2UiLCJjb21wbGV0ZSIsImRldiIsImxvY2FsIiwicWEiLCJzdHJpY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztRQTJDZ0JBLE8sR0FBQUEsTzs7QUEzQ2hCOztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxNQUFNQyxvQ0FBYyxJQUFwQjtBQUNBLE1BQU1DLDRCQUFVLGNBQWhCOztBQUVQLE1BQU1DLGFBQWE7QUFDakJELFdBQVMsWUFEUTtBQUVqQkQsZUFBYSw0QkFGSTtBQUdqQixRQUFNRyxPQUFOLEdBQWdCO0FBQ2QsVUFBTSwrQkFBZSxZQUFmLENBQU47QUFDQUMsWUFBUUMsR0FBUixDQUFZQyx3QkFBSUMsR0FBSixDQUFRQyxRQUFSLENBQWlCLFlBQWpCLEdBQStCLE1BQU0sd0JBQVMsV0FBVCxDQUFyQyxFQUFaO0FBQ0Q7QUFOZ0IsQ0FBbkI7O0FBU0EsTUFBTUMsTUFBTTtBQUNWUixXQUFTLEtBREM7QUFFVkQsZUFBYSwwQkFGSDtBQUdWLFFBQU1HLE9BQU4sR0FBZ0I7QUFDZCxVQUFNLCtCQUFlLEtBQWYsQ0FBTjtBQUNBQyxZQUFRQyxHQUFSLENBQVlDLHdCQUFJQyxHQUFKLENBQVFDLFFBQVIsQ0FBaUIsS0FBakIsR0FBd0IsTUFBTSx3QkFBUyxXQUFULENBQTlCLEVBQVo7QUFDRDtBQU5TLENBQVo7O0FBU0EsTUFBTUUsUUFBUTtBQUNaVCxXQUFTLE9BREc7QUFFWkQsZUFBYSwyQ0FGRDtBQUdaLFFBQU1HLE9BQU4sR0FBZ0I7QUFDZCxVQUFNLCtCQUFlLE9BQWYsQ0FBTjtBQUNBQyxZQUFRQyxHQUFSLENBQVlDLHdCQUFJQyxHQUFKLENBQVFDLFFBQVIsQ0FBaUIsT0FBakIsR0FBMEIsTUFBTSx3QkFBUyxXQUFULENBQWhDLEVBQVo7QUFDRDtBQU5XLENBQWQ7O0FBU0EsTUFBTUcsS0FBSztBQUNUVixXQUFTLElBREE7QUFFVEQsZUFBYSwrQkFGSjtBQUdULFFBQU1HLE9BQU4sR0FBZ0I7QUFDZCxVQUFNLCtCQUFlLElBQWYsQ0FBTjtBQUNBQyxZQUFRQyxHQUFSLENBQVlDLHdCQUFJQyxHQUFKLENBQVFDLFFBQVIsQ0FBaUIsSUFBakIsR0FBdUIsTUFBTSx3QkFBUyxXQUFULENBQTdCLEVBQVo7QUFDRDtBQU5RLENBQVg7O0FBU08sU0FBU1QsT0FBVCxDQUFpQlEsR0FBakIsRUFBc0I7QUFDM0IsU0FBT0EsSUFDSk4sT0FESSxDQUNJQyxVQURKLEVBRUpELE9BRkksQ0FFSVEsR0FGSixFQUdKUixPQUhJLENBR0lTLEtBSEosRUFJSlQsT0FKSSxDQUlJVSxFQUpKLEVBS0pDLE1BTEksRUFBUDtBQU1EIiwiZmlsZSI6InVzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNldEhvc3RFbnZOYW1lIH0gZnJvbSAnLi4vY2xpZW50cy9zZXJ2ZXItZW52JztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IHsgZ2V0VmFsdWUgfSBmcm9tICcuLi9zZXJ2aWNlcy9jYWNoZS1lbnYnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gbnVsbDtcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAndXNlIDxzZXJ2ZXI+JztcclxuXHJcbmNvbnN0IHByb2R1Y3Rpb24gPSB7XHJcbiAgY29tbWFuZDogJ3Byb2R1Y3Rpb24nLFxyXG4gIGRlc2NyaXB0aW9uOiAnU3dpdGNoIHRvIHNob3V0ZW0gbGl2ZSBlbnYnLFxyXG4gIGFzeW5jIGhhbmRsZXIoKSB7XHJcbiAgICBhd2FpdCBzZXRIb3N0RW52TmFtZSgncHJvZHVjdGlvbicpO1xyXG4gICAgY29uc29sZS5sb2cobXNnLnVzZS5jb21wbGV0ZSgncHJvZHVjdGlvbicsIGF3YWl0IGdldFZhbHVlKCdkZXZlbG9wZXInKSkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGRldiA9IHtcclxuICBjb21tYW5kOiAnZGV2JyxcclxuICBkZXNjcmlwdGlvbjogJ1N3aXRjaCB0byBzYXVyb3MgZGV2IGVudicsXHJcbiAgYXN5bmMgaGFuZGxlcigpIHtcclxuICAgIGF3YWl0IHNldEhvc3RFbnZOYW1lKCdkZXYnKTtcclxuICAgIGNvbnNvbGUubG9nKG1zZy51c2UuY29tcGxldGUoJ2RldicsIGF3YWl0IGdldFZhbHVlKCdkZXZlbG9wZXInKSkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGxvY2FsID0ge1xyXG4gIGNvbW1hbmQ6ICdsb2NhbCcsXHJcbiAgZGVzY3JpcHRpb246ICdVc2UgYXBpIGVuZHBvaW50cyBzZXQgaW4gT1MgZW52IHZhcmlhYmxlcycsXHJcbiAgYXN5bmMgaGFuZGxlcigpIHtcclxuICAgIGF3YWl0IHNldEhvc3RFbnZOYW1lKCdsb2NhbCcpO1xyXG4gICAgY29uc29sZS5sb2cobXNnLnVzZS5jb21wbGV0ZSgnbG9jYWwnLCBhd2FpdCBnZXRWYWx1ZSgnZGV2ZWxvcGVyJykpKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBxYSA9IHtcclxuICBjb21tYW5kOiAncWEnLFxyXG4gIGRlc2NyaXB0aW9uOiAnU3dpdGNoIHRvIHVzaW5nIHNhdXJvcyBxYSBlbnYnLFxyXG4gIGFzeW5jIGhhbmRsZXIoKSB7XHJcbiAgICBhd2FpdCBzZXRIb3N0RW52TmFtZSgncWEnKTtcclxuICAgIGNvbnNvbGUubG9nKG1zZy51c2UuY29tcGxldGUoJ3FhJywgYXdhaXQgZ2V0VmFsdWUoJ2RldmVsb3BlcicpKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkZXIodXNlKSB7XHJcbiAgcmV0dXJuIHVzZVxyXG4gICAgLmNvbW1hbmQocHJvZHVjdGlvbilcclxuICAgIC5jb21tYW5kKGRldilcclxuICAgIC5jb21tYW5kKGxvY2FsKVxyXG4gICAgLmNvbW1hbmQocWEpXHJcbiAgICAuc3RyaWN0KCk7XHJcbn1cclxuIl19