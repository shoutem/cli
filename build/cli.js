'use strict';

require('colors');

require('fetch-everywhere');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _homeDir = require('./home-dir');

var _homeDir2 = _interopRequireDefault(_homeDir);

var _updateCli = require('./commands/update-cli');

var _updateCli2 = _interopRequireDefault(_updateCli);

var _analytics = require('./services/analytics');

var analytics = _interopRequireWildcard(_analytics);

var _validation = require('./services/validation');

var _authService = require('./clients/auth-service');

var _services = require('../config/services');

var _services2 = _interopRequireDefault(_services);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('yargonaut').helpStyle('green.underline').errorsStyle('red.bold');

const homeDir = (0, _homeDir2.default)();
const cliReferenceUrl = 'https://shoutem.github.io/docs/extensions/reference/cli';
const cliArgs = process.argv.slice(2);

if (!(0, _validation.isAscii)(homeDir) || (0, _validation.containsSpace)(homeDir)) {
  console.log(`ERROR: shoutem CLI homedir (currently \`${homeDir}\`) contains non-ascii characters or a space`.red.bold);
  console.log('Change it by setting SHOUTEM_CLI_HOME environmental variable'.red.bold);
  console.log(`Check ${cliReferenceUrl} for more info`.red.bold);
  process.exit(1);
}

analytics.setArgv(process.argv);

(async () => {
  if (await (0, _updateCli2.default)(cliArgs)) {
    return null;
  }
  const refreshToken = await (0, _authService.getRefreshToken)();
  await (0, _authService.authorizeRequests)(refreshToken);

  const cli = _yargs2.default.usage('Usage: shoutem [command] [-h]').option('version', {
    alias: 'v',
    description: 'Show version number'
  }).commandDir('cli') // takes over a second to go through all the files in the 'commands' dir
  .strict().help().epilog(`If you don't have a developer account, you can create one at ${_services2.default.appBuilder.bold}.\n\n` + `A more detailed reference on how to use Shoutem CLI can be found on the Developer Portal: ${cliReferenceUrl.bold}`).alias('help', 'h');

  const { argv } = cli;

  if (argv._.length === 0) {
    cli.showHelp();
  }

  analytics.setCommandName(argv._[0]);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGkuanMiXSwibmFtZXMiOlsiYW5hbHl0aWNzIiwicmVxdWlyZSIsImhlbHBTdHlsZSIsImVycm9yc1N0eWxlIiwiaG9tZURpciIsImNsaVJlZmVyZW5jZVVybCIsImNsaUFyZ3MiLCJwcm9jZXNzIiwiYXJndiIsInNsaWNlIiwiY29uc29sZSIsImxvZyIsInJlZCIsImJvbGQiLCJleGl0Iiwic2V0QXJndiIsInJlZnJlc2hUb2tlbiIsImNsaSIsInlhcmdzIiwidXNhZ2UiLCJvcHRpb24iLCJhbGlhcyIsImRlc2NyaXB0aW9uIiwiY29tbWFuZERpciIsInN0cmljdCIsImhlbHAiLCJlcGlsb2ciLCJhcGlVcmxzIiwiYXBwQnVpbGRlciIsIl8iLCJsZW5ndGgiLCJzaG93SGVscCIsInNldENvbW1hbmROYW1lIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxTOztBQUNaOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBQyxRQUFRLFdBQVIsRUFDS0MsU0FETCxDQUNlLGlCQURmLEVBRUtDLFdBRkwsQ0FFaUIsVUFGakI7O0FBSUEsTUFBTUMsVUFBVSx3QkFBaEI7QUFDQSxNQUFNQyxrQkFBa0IseURBQXhCO0FBQ0EsTUFBTUMsVUFBVUMsUUFBUUMsSUFBUixDQUFhQyxLQUFiLENBQW1CLENBQW5CLENBQWhCOztBQUVBLElBQUksQ0FBQyx5QkFBUUwsT0FBUixDQUFELElBQXFCLCtCQUFjQSxPQUFkLENBQXpCLEVBQWlEO0FBQy9DTSxVQUFRQyxHQUFSLENBQWEsMkNBQTBDUCxPQUFRLDhDQUFuRCxDQUFpR1EsR0FBakcsQ0FBcUdDLElBQWpIO0FBQ0FILFVBQVFDLEdBQVIsQ0FBWSwrREFBK0RDLEdBQS9ELENBQW1FQyxJQUEvRTtBQUNBSCxVQUFRQyxHQUFSLENBQWEsU0FBUU4sZUFBZ0IsZ0JBQXpCLENBQXlDTyxHQUF6QyxDQUE2Q0MsSUFBekQ7QUFDQU4sVUFBUU8sSUFBUixDQUFhLENBQWI7QUFDRDs7QUFFRGQsVUFBVWUsT0FBVixDQUFrQlIsUUFBUUMsSUFBMUI7O0FBRUEsQ0FBQyxZQUFZO0FBQ1gsTUFBSSxNQUFNLHlCQUFXRixPQUFYLENBQVYsRUFBK0I7QUFDN0IsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxRQUFNVSxlQUFlLE1BQU0sbUNBQTNCO0FBQ0EsUUFBTSxvQ0FBa0JBLFlBQWxCLENBQU47O0FBRUEsUUFBTUMsTUFBTUMsZ0JBQU1DLEtBQU4sQ0FBWSwrQkFBWixFQUNQQyxNQURPLENBQ0EsU0FEQSxFQUNXO0FBQ2pCQyxXQUFPLEdBRFU7QUFFakJDLGlCQUFhO0FBRkksR0FEWCxFQUtQQyxVQUxPLENBS0ksS0FMSixFQUtXO0FBTFgsR0FNUEMsTUFOTyxHQU9QQyxJQVBPLEdBUVBDLE1BUk8sQ0FRQyxnRUFBK0RDLG1CQUFRQyxVQUFSLENBQW1CZixJQUFLLE9BQXhGLEdBQ0gsNkZBQTRGUixnQkFBZ0JRLElBQUssRUFUOUcsRUFVUFEsS0FWTyxDQVVELE1BVkMsRUFVTyxHQVZQLENBQVo7O0FBWUEsUUFBTSxFQUFFYixJQUFGLEtBQVdTLEdBQWpCOztBQUVBLE1BQUlULEtBQUtxQixDQUFMLENBQU9DLE1BQVAsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkJiLFFBQUljLFFBQUo7QUFDRDs7QUFFRC9CLFlBQVVnQyxjQUFWLENBQXlCeEIsS0FBS3FCLENBQUwsQ0FBTyxDQUFQLENBQXpCO0FBQ0QsQ0ExQkQiLCJmaWxlIjoiY2xpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjb2xvcnMnO1xyXG5pbXBvcnQgJ2ZldGNoLWV2ZXJ5d2hlcmUnO1xyXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xyXG5cclxuaW1wb3J0IGdldEhvbWVEaXIgZnJvbSAnLi9ob21lLWRpcic7XHJcbmltcG9ydCBhdXRvVXBkYXRlIGZyb20gJy4vY29tbWFuZHMvdXBkYXRlLWNsaSc7XHJcbmltcG9ydCAqIGFzIGFuYWx5dGljcyBmcm9tICcuL3NlcnZpY2VzL2FuYWx5dGljcyc7XHJcbmltcG9ydCB7IGlzQXNjaWksIGNvbnRhaW5zU3BhY2UgfSBmcm9tICcuL3NlcnZpY2VzL3ZhbGlkYXRpb24nO1xyXG5pbXBvcnQgeyBhdXRob3JpemVSZXF1ZXN0cywgZ2V0UmVmcmVzaFRva2VuIH0gZnJvbSAnLi9jbGllbnRzL2F1dGgtc2VydmljZSc7XHJcbmltcG9ydCBhcGlVcmxzIGZyb20gJy4uL2NvbmZpZy9zZXJ2aWNlcyc7XHJcblxyXG5yZXF1aXJlKCd5YXJnb25hdXQnKVxyXG4gICAgLmhlbHBTdHlsZSgnZ3JlZW4udW5kZXJsaW5lJylcclxuICAgIC5lcnJvcnNTdHlsZSgncmVkLmJvbGQnKTtcclxuXHJcbmNvbnN0IGhvbWVEaXIgPSBnZXRIb21lRGlyKCk7XHJcbmNvbnN0IGNsaVJlZmVyZW5jZVVybCA9ICdodHRwczovL3Nob3V0ZW0uZ2l0aHViLmlvL2RvY3MvZXh0ZW5zaW9ucy9yZWZlcmVuY2UvY2xpJztcclxuY29uc3QgY2xpQXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcclxuXHJcbmlmICghaXNBc2NpaShob21lRGlyKSB8fCBjb250YWluc1NwYWNlKGhvbWVEaXIpKSB7XHJcbiAgY29uc29sZS5sb2coYEVSUk9SOiBzaG91dGVtIENMSSBob21lZGlyIChjdXJyZW50bHkgXFxgJHtob21lRGlyfVxcYCkgY29udGFpbnMgbm9uLWFzY2lpIGNoYXJhY3RlcnMgb3IgYSBzcGFjZWAucmVkLmJvbGQpO1xyXG4gIGNvbnNvbGUubG9nKCdDaGFuZ2UgaXQgYnkgc2V0dGluZyBTSE9VVEVNX0NMSV9IT01FIGVudmlyb25tZW50YWwgdmFyaWFibGUnLnJlZC5ib2xkKTtcclxuICBjb25zb2xlLmxvZyhgQ2hlY2sgJHtjbGlSZWZlcmVuY2VVcmx9IGZvciBtb3JlIGluZm9gLnJlZC5ib2xkKTtcclxuICBwcm9jZXNzLmV4aXQoMSk7XHJcbn1cclxuXHJcbmFuYWx5dGljcy5zZXRBcmd2KHByb2Nlc3MuYXJndik7XHJcblxyXG4oYXN5bmMgKCkgPT4ge1xyXG4gIGlmIChhd2FpdCBhdXRvVXBkYXRlKGNsaUFyZ3MpKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgY29uc3QgcmVmcmVzaFRva2VuID0gYXdhaXQgZ2V0UmVmcmVzaFRva2VuKCk7XHJcbiAgYXdhaXQgYXV0aG9yaXplUmVxdWVzdHMocmVmcmVzaFRva2VuKTtcclxuXHJcbiAgY29uc3QgY2xpID0geWFyZ3MudXNhZ2UoJ1VzYWdlOiBzaG91dGVtIFtjb21tYW5kXSBbLWhdJylcclxuICAgICAgLm9wdGlvbigndmVyc2lvbicsIHtcclxuICAgICAgICBhbGlhczogJ3YnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyB2ZXJzaW9uIG51bWJlcicsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5jb21tYW5kRGlyKCdjbGknKSAvLyB0YWtlcyBvdmVyIGEgc2Vjb25kIHRvIGdvIHRocm91Z2ggYWxsIHRoZSBmaWxlcyBpbiB0aGUgJ2NvbW1hbmRzJyBkaXJcclxuICAgICAgLnN0cmljdCgpXHJcbiAgICAgIC5oZWxwKClcclxuICAgICAgLmVwaWxvZyhgSWYgeW91IGRvbid0IGhhdmUgYSBkZXZlbG9wZXIgYWNjb3VudCwgeW91IGNhbiBjcmVhdGUgb25lIGF0ICR7YXBpVXJscy5hcHBCdWlsZGVyLmJvbGR9LlxcblxcbmAgK1xyXG4gICAgICAgICAgYEEgbW9yZSBkZXRhaWxlZCByZWZlcmVuY2Ugb24gaG93IHRvIHVzZSBTaG91dGVtIENMSSBjYW4gYmUgZm91bmQgb24gdGhlIERldmVsb3BlciBQb3J0YWw6ICR7Y2xpUmVmZXJlbmNlVXJsLmJvbGR9YClcclxuICAgICAgLmFsaWFzKCdoZWxwJywgJ2gnKTtcclxuXHJcbiAgY29uc3QgeyBhcmd2IH0gPSBjbGk7XHJcblxyXG4gIGlmIChhcmd2Ll8ubGVuZ3RoID09PSAwKSB7XHJcbiAgICBjbGkuc2hvd0hlbHAoKTtcclxuICB9XHJcblxyXG4gIGFuYWx5dGljcy5zZXRDb21tYW5kTmFtZShhcmd2Ll9bMF0pO1xyXG59KSgpO1xyXG4iXX0=