'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.description = exports.command = undefined;
exports.builder = builder;

var _show = require('../commands/show.js');

var _show2 = _interopRequireDefault(_show);

var _errorHandler = require('../services/error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const command = exports.command = 'show';
const description = exports.description = 'Shows user status and list of linked extensions';
const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(() => (0, _show2.default)(args));
function builder(yargs) {
  return yargs.options({
    all: {
      type: 'boolean',
      default: false
    }
  }).usage(`shoutem ${command}\n\n${description}`);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc2hvdy5qcyJdLCJuYW1lcyI6WyJidWlsZGVyIiwiY29tbWFuZCIsImRlc2NyaXB0aW9uIiwiaGFuZGxlciIsImFyZ3MiLCJ5YXJncyIsIm9wdGlvbnMiLCJhbGwiLCJ0eXBlIiwiZGVmYXVsdCIsInVzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFNZ0JBLE8sR0FBQUEsTzs7QUFOaEI7Ozs7QUFDQTs7OztBQUVPLE1BQU1DLDRCQUFVLE1BQWhCO0FBQ0EsTUFBTUMsb0NBQWMsaURBQXBCO0FBQ0EsTUFBTUMsNEJBQVVDLFFBQVEseUNBQXNCLE1BQU0sb0JBQUtBLElBQUwsQ0FBNUIsQ0FBeEI7QUFDQSxTQUFTSixPQUFULENBQWlCSyxLQUFqQixFQUF3QjtBQUM3QixTQUFPQSxNQUNKQyxPQURJLENBQ0k7QUFDUEMsU0FBSztBQUNIQyxZQUFNLFNBREg7QUFFSEMsZUFBUztBQUZOO0FBREUsR0FESixFQU9KQyxLQVBJLENBT0csV0FBVVQsT0FBUSxPQUFNQyxXQUFZLEVBUHZDLENBQVA7QUFRRCIsImZpbGUiOiJzaG93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNob3cgZnJvbSAnLi4vY29tbWFuZHMvc2hvdy5qcyc7XHJcbmltcG9ydCB7IGV4ZWN1dGVBbmRIYW5kbGVFcnJvciB9IGZyb20gJy4uL3NlcnZpY2VzL2Vycm9yLWhhbmRsZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAnc2hvdyc7XHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdTaG93cyB1c2VyIHN0YXR1cyBhbmQgbGlzdCBvZiBsaW5rZWQgZXh0ZW5zaW9ucyc7XHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXJncyA9PiBleGVjdXRlQW5kSGFuZGxlRXJyb3IoKCkgPT4gc2hvdyhhcmdzKSk7XHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZGVyKHlhcmdzKSB7XHJcbiAgcmV0dXJuIHlhcmdzXHJcbiAgICAub3B0aW9ucyh7XHJcbiAgICAgIGFsbDoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC51c2FnZShgc2hvdXRlbSAke2NvbW1hbmR9XFxuXFxuJHtkZXNjcmlwdGlvbn1gKTtcclxufVxyXG4iXX0=