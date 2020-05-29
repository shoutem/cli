'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.command = exports.description = undefined;

var _pushAll = require('../commands/push-all');

var _push = require('../commands/push');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _errorHandler = require('../services/error-handler');

var _multiglob = require('../services/multiglob');

var _multiglob2 = _interopRequireDefault(_multiglob);

var _confirmAdminAction = require('../commands/confirm-admin-action');

var _confirmAdminAction2 = _interopRequireDefault(_confirmAdminAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Upload local extension code and assets.';
const command = exports.command = 'push [paths..]';
const builder = exports.builder = yargs => {
  return yargs.options({
    nobuild: {
      type: 'boolean',
      description: 'Push the extension without building it. Use this option carefully!'
    },
    noconfirm: {
      type: 'boolean',
      description: 'Push extensions without asking for confirmation'
    },
    without: {
      type: 'array',
      description: 'Directory to skip. Can be passed multiple times for skipping multiple directories. Used only if multiple extensions are pushed.',
      requiresArg: true
    },
    nocheck: {
      type: 'boolean',
      description: 'Push without checking for syntax errors'
    }
  }).usage(`shoutem ${command} [options]\n\n${description}`);
};

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(async () => {
  if (!(await (0, _confirmAdminAction2.default)('WARNING: you are about tu push using shoutem developer. Are you sure about that?'))) {
    console.log('Push aborted'.bold.yellow);
    return null;
  }
  console.log('WARNING: shoutem push command is deprecated. Use shoutem publish instead'.yellow.bold);
  if (!args.paths.length) {
    await (0, _push.uploadExtension)(args);
    console.log(_user_messages2.default.push.complete());
    return;
  }

  args.paths = (0, _multiglob2.default)(args.paths);
  await (0, _pushAll.pushAll)(args);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcHVzaC5qcyJdLCJuYW1lcyI6WyJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJidWlsZGVyIiwieWFyZ3MiLCJvcHRpb25zIiwibm9idWlsZCIsInR5cGUiLCJub2NvbmZpcm0iLCJ3aXRob3V0IiwicmVxdWlyZXNBcmciLCJub2NoZWNrIiwidXNhZ2UiLCJoYW5kbGVyIiwiYXJncyIsImNvbnNvbGUiLCJsb2ciLCJib2xkIiwieWVsbG93IiwicGF0aHMiLCJsZW5ndGgiLCJtc2ciLCJwdXNoIiwiY29tcGxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLG9DQUFjLHlDQUFwQjtBQUNBLE1BQU1DLDRCQUFVLGdCQUFoQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQ0pDLE9BREksQ0FDSTtBQUNQQyxhQUFTO0FBQ1BDLFlBQU0sU0FEQztBQUVQTixtQkFBYTtBQUZOLEtBREY7QUFLUE8sZUFBVztBQUNURCxZQUFNLFNBREc7QUFFVE4sbUJBQWE7QUFGSixLQUxKO0FBU1BRLGFBQVM7QUFDUEYsWUFBTSxPQURDO0FBRVBOLG1CQUFhLGlJQUZOO0FBR1BTLG1CQUFhO0FBSE4sS0FURjtBQWNQQyxhQUFTO0FBQ1BKLFlBQU0sU0FEQztBQUVQTixtQkFBYTtBQUZOO0FBZEYsR0FESixFQW9CSlcsS0FwQkksQ0FvQkcsV0FBVVYsT0FBUSxpQkFBZ0JELFdBQVksRUFwQmpELENBQVA7QUFxQkQsQ0F0Qk07O0FBd0JBLE1BQU1ZLDRCQUFVQyxRQUFRLHlDQUFzQixZQUFZO0FBQy9ELE1BQUksRUFBQyxNQUFNLGtDQUFZLGtGQUFaLENBQVAsQ0FBSixFQUE0RztBQUMxR0MsWUFBUUMsR0FBUixDQUFZLGVBQWVDLElBQWYsQ0FBb0JDLE1BQWhDO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDREgsVUFBUUMsR0FBUixDQUFZLDJFQUEyRUUsTUFBM0UsQ0FBa0ZELElBQTlGO0FBQ0EsTUFBSSxDQUFDSCxLQUFLSyxLQUFMLENBQVdDLE1BQWhCLEVBQXdCO0FBQ3RCLFVBQU0sMkJBQWdCTixJQUFoQixDQUFOO0FBQ0FDLFlBQVFDLEdBQVIsQ0FBWUssd0JBQUlDLElBQUosQ0FBU0MsUUFBVCxFQUFaO0FBQ0E7QUFDRDs7QUFFRFQsT0FBS0ssS0FBTCxHQUFhLHlCQUFVTCxLQUFLSyxLQUFmLENBQWI7QUFDQSxRQUFNLHNCQUFRTCxJQUFSLENBQU47QUFDRCxDQWQ4QixDQUF4QiIsImZpbGUiOiJwdXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVzaEFsbCB9IGZyb20gJy4uL2NvbW1hbmRzL3B1c2gtYWxsJztcclxuaW1wb3J0IHsgdXBsb2FkRXh0ZW5zaW9uIH0gZnJvbSAnLi4vY29tbWFuZHMvcHVzaCc7XHJcbmltcG9ydCBtc2cgZnJvbSAnLi4vdXNlcl9tZXNzYWdlcyc7XHJcbmltcG9ydCB7IGV4ZWN1dGVBbmRIYW5kbGVFcnJvciB9IGZyb20gJy4uL3NlcnZpY2VzL2Vycm9yLWhhbmRsZXInO1xyXG5pbXBvcnQgbXVsdGlnbG9iIGZyb20gJy4uL3NlcnZpY2VzL211bHRpZ2xvYic7XHJcbmltcG9ydCBjb25maXJtUHVzaCBmcm9tICcuLi9jb21tYW5kcy9jb25maXJtLWFkbWluLWFjdGlvbic7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnVXBsb2FkIGxvY2FsIGV4dGVuc2lvbiBjb2RlIGFuZCBhc3NldHMuJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAncHVzaCBbcGF0aHMuLl0nO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHtcclxuICByZXR1cm4geWFyZ3NcclxuICAgIC5vcHRpb25zKHtcclxuICAgICAgbm9idWlsZDoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ1B1c2ggdGhlIGV4dGVuc2lvbiB3aXRob3V0IGJ1aWxkaW5nIGl0LiBVc2UgdGhpcyBvcHRpb24gY2FyZWZ1bGx5ISdcclxuICAgICAgfSxcclxuICAgICAgbm9jb25maXJtOiB7XHJcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUHVzaCBleHRlbnNpb25zIHdpdGhvdXQgYXNraW5nIGZvciBjb25maXJtYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHdpdGhvdXQ6IHtcclxuICAgICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRGlyZWN0b3J5IHRvIHNraXAuIENhbiBiZSBwYXNzZWQgbXVsdGlwbGUgdGltZXMgZm9yIHNraXBwaW5nIG11bHRpcGxlIGRpcmVjdG9yaWVzLiBVc2VkIG9ubHkgaWYgbXVsdGlwbGUgZXh0ZW5zaW9ucyBhcmUgcHVzaGVkLicsXHJcbiAgICAgICAgcmVxdWlyZXNBcmc6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIG5vY2hlY2s6IHtcclxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdQdXNoIHdpdGhvdXQgY2hlY2tpbmcgZm9yIHN5bnRheCBlcnJvcnMnXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfSBbb3B0aW9uc11cXG5cXG4ke2Rlc2NyaXB0aW9ufWApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhcmdzID0+IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcihhc3luYyAoKSA9PiB7XHJcbiAgaWYgKCFhd2FpdCBjb25maXJtUHVzaCgnV0FSTklORzogeW91IGFyZSBhYm91dCB0dSBwdXNoIHVzaW5nIHNob3V0ZW0gZGV2ZWxvcGVyLiBBcmUgeW91IHN1cmUgYWJvdXQgdGhhdD8nKSkge1xyXG4gICAgY29uc29sZS5sb2coJ1B1c2ggYWJvcnRlZCcuYm9sZC55ZWxsb3cpO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKCdXQVJOSU5HOiBzaG91dGVtIHB1c2ggY29tbWFuZCBpcyBkZXByZWNhdGVkLiBVc2Ugc2hvdXRlbSBwdWJsaXNoIGluc3RlYWQnLnllbGxvdy5ib2xkKTtcclxuICBpZiAoIWFyZ3MucGF0aHMubGVuZ3RoKSB7XHJcbiAgICBhd2FpdCB1cGxvYWRFeHRlbnNpb24oYXJncyk7XHJcbiAgICBjb25zb2xlLmxvZyhtc2cucHVzaC5jb21wbGV0ZSgpKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGFyZ3MucGF0aHMgPSBtdWx0aWdsb2IoYXJncy5wYXRocyk7XHJcbiAgYXdhaXQgcHVzaEFsbChhcmdzKTtcclxufSk7XHJcblxyXG4iXX0=