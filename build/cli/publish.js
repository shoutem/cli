'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.command = exports.description = undefined;
exports.handler = handler;

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _publish = require('../commands/publish');

var _pushAll = require('../commands/push-all');

var _errorHandler = require('../services/error-handler');

var _multiglob = require('../services/multiglob');

var _multiglob2 = _interopRequireDefault(_multiglob);

var _confirmAdminAction = require('../commands/confirm-admin-action');

var _confirmAdminAction2 = _interopRequireDefault(_confirmAdminAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = exports.description = 'Publish current extension version.';
const command = exports.command = 'publish [paths..]';
const builder = exports.builder = yargs => {
  return yargs.options({
    nobuild: {
      type: 'boolean',
      description: 'Push and publish the extension without building it. Use this option carefully!'
    },
    nopush: {
      type: 'boolean',
      description: 'Publish the extension without pushing it first. Use this option carefully!'
    }
  }).usage(`shoutem ${command} [options]\n\n${description}`);
};
async function handler(args) {
  if (!(await (0, _confirmAdminAction2.default)('WARNING: you are about to publish using shoutem developer. Are you sure about that?'))) {
    console.log('Publish aborted'.bold.yellow);
    return null;
  }

  console.log('WARNING: shoutem publish command is deprecated. Use shoutem extension publish instead'.yellow.bold);

  try {
    if (args.paths.length === 0) {
      await (0, _publish.pushAndPublish)(args);
      console.log('Success'.green.bold);
    } else {
      args.paths = (0, _multiglob2.default)(args.paths);
      const { pushed, notPushed } = await (0, _pushAll.pushAll)(args);

      const published = [];
      let notPublished = [];
      for (const extPath of pushed) {
        try {
          const result = await (0, _publish.publishExtension)(extPath);
          console.log(_user_messages2.default.publish.complete(result).green.bold);
          published.push(extPath);
        } catch (err) {
          await (0, _errorHandler.handleError)(err);
          notPublished.push(extPath);
        }
      }

      console.log();
      if (published.length > 0) {
        console.log(`Published:`);
        console.log(published.map(e => `  ${e}`).join('\n'));
      }

      notPublished = [...notPublished, ...notPushed];
      if (notPublished.length > 0) {
        console.log(`Not published:`);
        console.log(notPublished.map(e => `  ${e}`).join('\n'));
      }
    }
  } catch (err) {
    await (0, _errorHandler.handleError)(err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcHVibGlzaC5qcyJdLCJuYW1lcyI6WyJoYW5kbGVyIiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiYnVpbGRlciIsInlhcmdzIiwib3B0aW9ucyIsIm5vYnVpbGQiLCJ0eXBlIiwibm9wdXNoIiwidXNhZ2UiLCJhcmdzIiwiY29uc29sZSIsImxvZyIsImJvbGQiLCJ5ZWxsb3ciLCJwYXRocyIsImxlbmd0aCIsImdyZWVuIiwicHVzaGVkIiwibm90UHVzaGVkIiwicHVibGlzaGVkIiwibm90UHVibGlzaGVkIiwiZXh0UGF0aCIsInJlc3VsdCIsIm1zZyIsInB1Ymxpc2giLCJjb21wbGV0ZSIsInB1c2giLCJlcnIiLCJtYXAiLCJlIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBdUJzQkEsTyxHQUFBQSxPOztBQXZCdEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxNQUFNQyxvQ0FBYyxvQ0FBcEI7QUFDQSxNQUFNQyw0QkFBVSxtQkFBaEI7QUFDQSxNQUFNQyw0QkFBVUMsU0FBUztBQUM5QixTQUFPQSxNQUNKQyxPQURJLENBQ0k7QUFDUEMsYUFBUztBQUNQQyxZQUFNLFNBREM7QUFFUE4sbUJBQWE7QUFGTixLQURGO0FBS1BPLFlBQVE7QUFDTkQsWUFBTSxTQURBO0FBRU5OLG1CQUFhO0FBRlA7QUFMRCxHQURKLEVBV0pRLEtBWEksQ0FXRyxXQUFVUCxPQUFRLGlCQUFnQkQsV0FBWSxFQVhqRCxDQUFQO0FBWUQsQ0FiTTtBQWNBLGVBQWVELE9BQWYsQ0FBdUJVLElBQXZCLEVBQTZCO0FBQ2xDLE1BQUksRUFBQyxNQUFNLGtDQUFlLHFGQUFmLENBQVAsQ0FBSixFQUFrSDtBQUNoSEMsWUFBUUMsR0FBUixDQUFZLGtCQUFrQkMsSUFBbEIsQ0FBdUJDLE1BQW5DO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRURILFVBQVFDLEdBQVIsQ0FBWSx3RkFBd0ZFLE1BQXhGLENBQStGRCxJQUEzRzs7QUFFQSxNQUFJO0FBQ0YsUUFBSUgsS0FBS0ssS0FBTCxDQUFXQyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzNCLFlBQU0sNkJBQWVOLElBQWYsQ0FBTjtBQUNBQyxjQUFRQyxHQUFSLENBQVksVUFBVUssS0FBVixDQUFnQkosSUFBNUI7QUFDRCxLQUhELE1BR087QUFDTEgsV0FBS0ssS0FBTCxHQUFhLHlCQUFVTCxLQUFLSyxLQUFmLENBQWI7QUFDQSxZQUFNLEVBQUVHLE1BQUYsRUFBVUMsU0FBVixLQUF3QixNQUFNLHNCQUFRVCxJQUFSLENBQXBDOztBQUVBLFlBQU1VLFlBQVksRUFBbEI7QUFDQSxVQUFJQyxlQUFlLEVBQW5CO0FBQ0EsV0FBSyxNQUFNQyxPQUFYLElBQXNCSixNQUF0QixFQUE4QjtBQUM1QixZQUFJO0FBQ0YsZ0JBQU1LLFNBQVMsTUFBTSwrQkFBaUJELE9BQWpCLENBQXJCO0FBQ0FYLGtCQUFRQyxHQUFSLENBQVlZLHdCQUFJQyxPQUFKLENBQVlDLFFBQVosQ0FBcUJILE1BQXJCLEVBQTZCTixLQUE3QixDQUFtQ0osSUFBL0M7QUFDQU8sb0JBQVVPLElBQVYsQ0FBZUwsT0FBZjtBQUNELFNBSkQsQ0FJRSxPQUFPTSxHQUFQLEVBQVk7QUFDWixnQkFBTSwrQkFBWUEsR0FBWixDQUFOO0FBQ0FQLHVCQUFhTSxJQUFiLENBQWtCTCxPQUFsQjtBQUNEO0FBQ0Y7O0FBRURYLGNBQVFDLEdBQVI7QUFDQSxVQUFJUSxVQUFVSixNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCTCxnQkFBUUMsR0FBUixDQUFhLFlBQWI7QUFDQUQsZ0JBQVFDLEdBQVIsQ0FBWVEsVUFBVVMsR0FBVixDQUFjQyxLQUFNLEtBQUlBLENBQUUsRUFBMUIsRUFBNkJDLElBQTdCLENBQWtDLElBQWxDLENBQVo7QUFDRDs7QUFFRFYscUJBQWUsQ0FBQyxHQUFHQSxZQUFKLEVBQWtCLEdBQUdGLFNBQXJCLENBQWY7QUFDQSxVQUFJRSxhQUFhTCxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCTCxnQkFBUUMsR0FBUixDQUFhLGdCQUFiO0FBQ0FELGdCQUFRQyxHQUFSLENBQVlTLGFBQWFRLEdBQWIsQ0FBaUJDLEtBQU0sS0FBSUEsQ0FBRSxFQUE3QixFQUFnQ0MsSUFBaEMsQ0FBcUMsSUFBckMsQ0FBWjtBQUNEO0FBQ0Y7QUFDRixHQWpDRCxDQWlDRSxPQUFPSCxHQUFQLEVBQVk7QUFDWixVQUFNLCtCQUFZQSxHQUFaLENBQU47QUFDRDtBQUNGIiwiZmlsZSI6InB1Ymxpc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBwdWJsaXNoRXh0ZW5zaW9uLCBwdXNoQW5kUHVibGlzaCB9IGZyb20gJy4uL2NvbW1hbmRzL3B1Ymxpc2gnO1xyXG5pbXBvcnQgeyBwdXNoQWxsIH0gZnJvbSAnLi4vY29tbWFuZHMvcHVzaC1hbGwnO1xyXG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gJy4uL3NlcnZpY2VzL2Vycm9yLWhhbmRsZXInO1xyXG5pbXBvcnQgbXVsdGlnbG9iIGZyb20gJy4uL3NlcnZpY2VzL211bHRpZ2xvYic7XHJcbmltcG9ydCBjb25maXJtUHVibGlzaCBmcm9tICcuLi9jb21tYW5kcy9jb25maXJtLWFkbWluLWFjdGlvbic7XHJcblxyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnUHVibGlzaCBjdXJyZW50IGV4dGVuc2lvbiB2ZXJzaW9uLic7XHJcbmV4cG9ydCBjb25zdCBjb21tYW5kID0gJ3B1Ymxpc2ggW3BhdGhzLi5dJztcclxuZXhwb3J0IGNvbnN0IGJ1aWxkZXIgPSB5YXJncyA9PiB7XHJcbiAgcmV0dXJuIHlhcmdzXHJcbiAgICAub3B0aW9ucyh7XHJcbiAgICAgIG5vYnVpbGQ6IHtcclxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdQdXNoIGFuZCBwdWJsaXNoIHRoZSBleHRlbnNpb24gd2l0aG91dCBidWlsZGluZyBpdC4gVXNlIHRoaXMgb3B0aW9uIGNhcmVmdWxseSEnXHJcbiAgICAgIH0sXHJcbiAgICAgIG5vcHVzaDoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ1B1Ymxpc2ggdGhlIGV4dGVuc2lvbiB3aXRob3V0IHB1c2hpbmcgaXQgZmlyc3QuIFVzZSB0aGlzIG9wdGlvbiBjYXJlZnVsbHkhJ1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnVzYWdlKGBzaG91dGVtICR7Y29tbWFuZH0gW29wdGlvbnNdXFxuXFxuJHtkZXNjcmlwdGlvbn1gKTtcclxufTtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoYXJncykge1xyXG4gIGlmICghYXdhaXQgY29uZmlybVB1Ymxpc2goJ1dBUk5JTkc6IHlvdSBhcmUgYWJvdXQgdG8gcHVibGlzaCB1c2luZyBzaG91dGVtIGRldmVsb3Blci4gQXJlIHlvdSBzdXJlIGFib3V0IHRoYXQ/JykpIHtcclxuICAgIGNvbnNvbGUubG9nKCdQdWJsaXNoIGFib3J0ZWQnLmJvbGQueWVsbG93KTtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coJ1dBUk5JTkc6IHNob3V0ZW0gcHVibGlzaCBjb21tYW5kIGlzIGRlcHJlY2F0ZWQuIFVzZSBzaG91dGVtIGV4dGVuc2lvbiBwdWJsaXNoIGluc3RlYWQnLnllbGxvdy5ib2xkKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGlmIChhcmdzLnBhdGhzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhd2FpdCBwdXNoQW5kUHVibGlzaChhcmdzKTtcclxuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnLmdyZWVuLmJvbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJncy5wYXRocyA9IG11bHRpZ2xvYihhcmdzLnBhdGhzKTtcclxuICAgICAgY29uc3QgeyBwdXNoZWQsIG5vdFB1c2hlZCB9ID0gYXdhaXQgcHVzaEFsbChhcmdzKTtcclxuXHJcbiAgICAgIGNvbnN0IHB1Ymxpc2hlZCA9IFtdO1xyXG4gICAgICBsZXQgbm90UHVibGlzaGVkID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgZXh0UGF0aCBvZiBwdXNoZWQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHVibGlzaEV4dGVuc2lvbihleHRQYXRoKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKG1zZy5wdWJsaXNoLmNvbXBsZXRlKHJlc3VsdCkuZ3JlZW4uYm9sZCk7XHJcbiAgICAgICAgICBwdWJsaXNoZWQucHVzaChleHRQYXRoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIGF3YWl0IGhhbmRsZUVycm9yKGVycik7XHJcbiAgICAgICAgICBub3RQdWJsaXNoZWQucHVzaChleHRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCk7XHJcbiAgICAgIGlmIChwdWJsaXNoZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBQdWJsaXNoZWQ6YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocHVibGlzaGVkLm1hcChlID0+IGAgICR7ZX1gKS5qb2luKCdcXG4nKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5vdFB1Ymxpc2hlZCA9IFsuLi5ub3RQdWJsaXNoZWQsIC4uLm5vdFB1c2hlZF07XHJcbiAgICAgIGlmIChub3RQdWJsaXNoZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBOb3QgcHVibGlzaGVkOmApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG5vdFB1Ymxpc2hlZC5tYXAoZSA9PiBgICAke2V9YCkuam9pbignXFxuJykpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBhd2FpdCBoYW5kbGVFcnJvcihlcnIpO1xyXG4gIH1cclxufVxyXG4iXX0=