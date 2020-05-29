'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.promptExtensionInit = promptExtensionInit;
exports.initExtension = initExtension;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _decamelize = require('decamelize');

var _decamelize2 = _interopRequireDefault(_decamelize);

var _fsExtra = require('fs-extra');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _login = require('../commands/login');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _extensionManager = require('../clients/extension-manager');

var _extension = require('../services/extension');

var utils = _interopRequireWildcard(_extension);

var _extensionTemplate = require('../services/extension-template');

var _diff = require('../services/diff');

var _data = require('../services/data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateNoPatchSemver(version) {
  const [a, b] = version.split('.');
  return [a, b, '*'].join('.');
}

async function promptExtensionInit(extName) {
  const name = _lodash2.default.kebabCase(extName);
  const title = _lodash2.default.upperFirst((0, _decamelize2.default)(extName, ' '));
  const version = '0.0.1';

  const questions = [{
    name: 'title',
    message: 'Title',
    default: title
  }, {
    name: 'version',
    message: 'Version',
    default: version,
    validate: value => value.match(/^(\d+)\.(\d+)\.(\d+)+$/) ? true : 'Version must contain numbers in format X.Y.Z'
  }, {
    name: 'description',
    message: 'Description'
  }];

  console.log(_user_messages2.default.init.requestInfo());
  const answer = await _inquirer2.default.prompt(questions);

  const platformVersions = (await (0, _extensionManager.getPlatforms)()).filter(({ published }) => published).map(({ version }) => version);

  return _extends({ name }, answer, { platform: generateNoPatchSemver(_lodash2.default.first(platformVersions)) });
}

async function initExtension(extName, extensionPath = process.cwd()) {
  const developer = await (0, _login.ensureUserIsLoggedIn)();
  const extJson = await promptExtensionInit(extName);

  utils.getExtensionCanonicalName(developer.name, extJson.name, extJson.version);

  const dirname = `${developer.name}.${extJson.name}`;
  if (await (0, _fsExtra.pathExists)(_path2.default.join(process.cwd(), dirname))) {
    throw new Error(`Folder ${dirname} already exists.`);
  }

  const packageJsonString = (0, _data.stringify)({
    name: `${developer.name}.${extJson.name}`,
    version: extJson.version,
    description: extJson.description
  });

  await (0, _diff.offerChanges)((await (0, _extensionTemplate.instantiateExtensionTemplate)('init', {
    extensionPath,
    devName: developer.name,
    extJson,
    packageJsonString
  })));

  return _path2.default.join(extensionPath, dirname);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbml0LmpzIl0sIm5hbWVzIjpbInByb21wdEV4dGVuc2lvbkluaXQiLCJpbml0RXh0ZW5zaW9uIiwidXRpbHMiLCJnZW5lcmF0ZU5vUGF0Y2hTZW12ZXIiLCJ2ZXJzaW9uIiwiYSIsImIiLCJzcGxpdCIsImpvaW4iLCJleHROYW1lIiwibmFtZSIsIl8iLCJrZWJhYkNhc2UiLCJ0aXRsZSIsInVwcGVyRmlyc3QiLCJxdWVzdGlvbnMiLCJtZXNzYWdlIiwiZGVmYXVsdCIsInZhbGlkYXRlIiwidmFsdWUiLCJtYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJtc2ciLCJpbml0IiwicmVxdWVzdEluZm8iLCJhbnN3ZXIiLCJpbnF1aXJlciIsInByb21wdCIsInBsYXRmb3JtVmVyc2lvbnMiLCJmaWx0ZXIiLCJwdWJsaXNoZWQiLCJtYXAiLCJwbGF0Zm9ybSIsImZpcnN0IiwiZXh0ZW5zaW9uUGF0aCIsInByb2Nlc3MiLCJjd2QiLCJkZXZlbG9wZXIiLCJleHRKc29uIiwiZ2V0RXh0ZW5zaW9uQ2Fub25pY2FsTmFtZSIsImRpcm5hbWUiLCJwYXRoIiwiRXJyb3IiLCJwYWNrYWdlSnNvblN0cmluZyIsImRlc2NyaXB0aW9uIiwiZGV2TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFtQnNCQSxtQixHQUFBQSxtQjtRQStCQUMsYSxHQUFBQSxhOztBQWxEdEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQyxLOztBQUNaOztBQUNBOztBQUNBOzs7Ozs7QUFHQSxTQUFTQyxxQkFBVCxDQUErQkMsT0FBL0IsRUFBd0M7QUFDdEMsUUFBTSxDQUFDQyxDQUFELEVBQUlDLENBQUosSUFBU0YsUUFBUUcsS0FBUixDQUFjLEdBQWQsQ0FBZjtBQUNBLFNBQU8sQ0FBQ0YsQ0FBRCxFQUFJQyxDQUFKLEVBQU8sR0FBUCxFQUFZRSxJQUFaLENBQWlCLEdBQWpCLENBQVA7QUFDRDs7QUFFTSxlQUFlUixtQkFBZixDQUFtQ1MsT0FBbkMsRUFBNEM7QUFDakQsUUFBTUMsT0FBT0MsaUJBQUVDLFNBQUYsQ0FBWUgsT0FBWixDQUFiO0FBQ0EsUUFBTUksUUFBUUYsaUJBQUVHLFVBQUYsQ0FBYSwwQkFBV0wsT0FBWCxFQUFvQixHQUFwQixDQUFiLENBQWQ7QUFDQSxRQUFNTCxVQUFVLE9BQWhCOztBQUVBLFFBQU1XLFlBQVksQ0FBQztBQUNqQkwsVUFBTSxPQURXO0FBRWpCTSxhQUFTLE9BRlE7QUFHakJDLGFBQVNKO0FBSFEsR0FBRCxFQUlmO0FBQ0RILFVBQU0sU0FETDtBQUVETSxhQUFTLFNBRlI7QUFHREMsYUFBU2IsT0FIUjtBQUlEYyxjQUFVQyxTQUFTQSxNQUFNQyxLQUFOLENBQVksd0JBQVosSUFDRyxJQURILEdBRUc7QUFOckIsR0FKZSxFQVdmO0FBQ0RWLFVBQU0sYUFETDtBQUVETSxhQUFTO0FBRlIsR0FYZSxDQUFsQjs7QUFnQkFLLFVBQVFDLEdBQVIsQ0FBWUMsd0JBQUlDLElBQUosQ0FBU0MsV0FBVCxFQUFaO0FBQ0EsUUFBTUMsU0FBUyxNQUFNQyxtQkFBU0MsTUFBVCxDQUFnQmIsU0FBaEIsQ0FBckI7O0FBRUEsUUFBTWMsbUJBQW1CLENBQUMsTUFBTSxxQ0FBUCxFQUN0QkMsTUFEc0IsQ0FDZixDQUFDLEVBQUVDLFNBQUYsRUFBRCxLQUFtQkEsU0FESixFQUV0QkMsR0FGc0IsQ0FFbEIsQ0FBQyxFQUFFNUIsT0FBRixFQUFELEtBQWlCQSxPQUZDLENBQXpCOztBQUlBLG9CQUFTTSxJQUFULElBQWtCZ0IsTUFBbEIsSUFBMEJPLFVBQVU5QixzQkFBc0JRLGlCQUFFdUIsS0FBRixDQUFRTCxnQkFBUixDQUF0QixDQUFwQztBQUNEOztBQUVNLGVBQWU1QixhQUFmLENBQTZCUSxPQUE3QixFQUFzQzBCLGdCQUFnQkMsUUFBUUMsR0FBUixFQUF0RCxFQUFxRTtBQUMxRSxRQUFNQyxZQUFZLE1BQU0sa0NBQXhCO0FBQ0EsUUFBTUMsVUFBVSxNQUFNdkMsb0JBQW9CUyxPQUFwQixDQUF0Qjs7QUFFQVAsUUFBTXNDLHlCQUFOLENBQWdDRixVQUFVNUIsSUFBMUMsRUFBZ0Q2QixRQUFRN0IsSUFBeEQsRUFBOEQ2QixRQUFRbkMsT0FBdEU7O0FBRUEsUUFBTXFDLFVBQVcsR0FBRUgsVUFBVTVCLElBQUssSUFBRzZCLFFBQVE3QixJQUFLLEVBQWxEO0FBQ0EsTUFBSSxNQUFNLHlCQUFXZ0MsZUFBS2xDLElBQUwsQ0FBVTRCLFFBQVFDLEdBQVIsRUFBVixFQUF5QkksT0FBekIsQ0FBWCxDQUFWLEVBQXlEO0FBQ3ZELFVBQU0sSUFBSUUsS0FBSixDQUFXLFVBQVNGLE9BQVEsa0JBQTVCLENBQU47QUFDRDs7QUFFRCxRQUFNRyxvQkFBb0IscUJBQVU7QUFDbENsQyxVQUFPLEdBQUU0QixVQUFVNUIsSUFBSyxJQUFHNkIsUUFBUTdCLElBQUssRUFETjtBQUVsQ04sYUFBU21DLFFBQVFuQyxPQUZpQjtBQUdsQ3lDLGlCQUFhTixRQUFRTTtBQUhhLEdBQVYsQ0FBMUI7O0FBTUEsUUFBTSx5QkFBYSxNQUFNLHFEQUE2QixNQUE3QixFQUFxQztBQUM1RFYsaUJBRDREO0FBRTVEVyxhQUFTUixVQUFVNUIsSUFGeUM7QUFHNUQ2QixXQUg0RDtBQUk1REs7QUFKNEQsR0FBckMsQ0FBbkIsRUFBTjs7QUFPQSxTQUFPRixlQUFLbEMsSUFBTCxDQUFVMkIsYUFBVixFQUF5Qk0sT0FBekIsQ0FBUDtBQUNEIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgaW5xdWlyZXIgZnJvbSAnaW5xdWlyZXInO1xyXG5pbXBvcnQgZGVjYW1lbGl6ZSBmcm9tICdkZWNhbWVsaXplJztcclxuaW1wb3J0IHsgcGF0aEV4aXN0cyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGVuc3VyZVVzZXJJc0xvZ2dlZEluIH0gZnJvbSAnLi4vY29tbWFuZHMvbG9naW4nO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBnZXRQbGF0Zm9ybXMgfSBmcm9tICcuLi9jbGllbnRzL2V4dGVuc2lvbi1tYW5hZ2VyJztcclxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi4vc2VydmljZXMvZXh0ZW5zaW9uJztcclxuaW1wb3J0IHtpbnN0YW50aWF0ZUV4dGVuc2lvblRlbXBsYXRlfSBmcm9tIFwiLi4vc2VydmljZXMvZXh0ZW5zaW9uLXRlbXBsYXRlXCI7XHJcbmltcG9ydCB7b2ZmZXJDaGFuZ2VzfSBmcm9tIFwiLi4vc2VydmljZXMvZGlmZlwiO1xyXG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSBcIi4uL3NlcnZpY2VzL2RhdGFcIjtcclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZU5vUGF0Y2hTZW12ZXIodmVyc2lvbikge1xyXG4gIGNvbnN0IFthLCBiXSA9IHZlcnNpb24uc3BsaXQoJy4nKTtcclxuICByZXR1cm4gW2EsIGIsICcqJ10uam9pbignLicpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvbXB0RXh0ZW5zaW9uSW5pdChleHROYW1lKSB7XHJcbiAgY29uc3QgbmFtZSA9IF8ua2ViYWJDYXNlKGV4dE5hbWUpO1xyXG4gIGNvbnN0IHRpdGxlID0gXy51cHBlckZpcnN0KGRlY2FtZWxpemUoZXh0TmFtZSwgJyAnKSk7XHJcbiAgY29uc3QgdmVyc2lvbiA9ICcwLjAuMSc7XHJcblxyXG4gIGNvbnN0IHF1ZXN0aW9ucyA9IFt7XHJcbiAgICBuYW1lOiAndGl0bGUnLFxyXG4gICAgbWVzc2FnZTogJ1RpdGxlJyxcclxuICAgIGRlZmF1bHQ6IHRpdGxlLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6ICd2ZXJzaW9uJyxcclxuICAgIG1lc3NhZ2U6ICdWZXJzaW9uJyxcclxuICAgIGRlZmF1bHQ6IHZlcnNpb24sXHJcbiAgICB2YWxpZGF0ZTogdmFsdWUgPT4gdmFsdWUubWF0Y2goL14oXFxkKylcXC4oXFxkKylcXC4oXFxkKykrJC8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICdWZXJzaW9uIG11c3QgY29udGFpbiBudW1iZXJzIGluIGZvcm1hdCBYLlkuWicsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogJ2Rlc2NyaXB0aW9uJyxcclxuICAgIG1lc3NhZ2U6ICdEZXNjcmlwdGlvbicsXHJcbiAgfV07XHJcblxyXG4gIGNvbnNvbGUubG9nKG1zZy5pbml0LnJlcXVlc3RJbmZvKCkpO1xyXG4gIGNvbnN0IGFuc3dlciA9IGF3YWl0IGlucXVpcmVyLnByb21wdChxdWVzdGlvbnMpO1xyXG5cclxuICBjb25zdCBwbGF0Zm9ybVZlcnNpb25zID0gKGF3YWl0IGdldFBsYXRmb3JtcygpKVxyXG4gICAgLmZpbHRlcigoeyBwdWJsaXNoZWQgfSkgPT4gcHVibGlzaGVkKVxyXG4gICAgLm1hcCgoeyB2ZXJzaW9uIH0pID0+IHZlcnNpb24pO1xyXG5cclxuICByZXR1cm4geyBuYW1lLCAuLi5hbnN3ZXIsIHBsYXRmb3JtOiBnZW5lcmF0ZU5vUGF0Y2hTZW12ZXIoXy5maXJzdChwbGF0Zm9ybVZlcnNpb25zKSkgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRFeHRlbnNpb24oZXh0TmFtZSwgZXh0ZW5zaW9uUGF0aCA9IHByb2Nlc3MuY3dkKCkpIHtcclxuICBjb25zdCBkZXZlbG9wZXIgPSBhd2FpdCBlbnN1cmVVc2VySXNMb2dnZWRJbigpO1xyXG4gIGNvbnN0IGV4dEpzb24gPSBhd2FpdCBwcm9tcHRFeHRlbnNpb25Jbml0KGV4dE5hbWUpO1xyXG5cclxuICB1dGlscy5nZXRFeHRlbnNpb25DYW5vbmljYWxOYW1lKGRldmVsb3Blci5uYW1lLCBleHRKc29uLm5hbWUsIGV4dEpzb24udmVyc2lvbik7XHJcblxyXG4gIGNvbnN0IGRpcm5hbWUgPSBgJHtkZXZlbG9wZXIubmFtZX0uJHtleHRKc29uLm5hbWV9YDtcclxuICBpZiAoYXdhaXQgcGF0aEV4aXN0cyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZGlybmFtZSkpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZvbGRlciAke2Rpcm5hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcGFja2FnZUpzb25TdHJpbmcgPSBzdHJpbmdpZnkoe1xyXG4gICAgbmFtZTogYCR7ZGV2ZWxvcGVyLm5hbWV9LiR7ZXh0SnNvbi5uYW1lfWAsXHJcbiAgICB2ZXJzaW9uOiBleHRKc29uLnZlcnNpb24sXHJcbiAgICBkZXNjcmlwdGlvbjogZXh0SnNvbi5kZXNjcmlwdGlvbixcclxuICB9KTtcclxuXHJcbiAgYXdhaXQgb2ZmZXJDaGFuZ2VzKGF3YWl0IGluc3RhbnRpYXRlRXh0ZW5zaW9uVGVtcGxhdGUoJ2luaXQnLCB7XHJcbiAgICBleHRlbnNpb25QYXRoLFxyXG4gICAgZGV2TmFtZTogZGV2ZWxvcGVyLm5hbWUsXHJcbiAgICBleHRKc29uLFxyXG4gICAgcGFja2FnZUpzb25TdHJpbmcsXHJcbiAgfSkpO1xyXG5cclxuICByZXR1cm4gcGF0aC5qb2luKGV4dGVuc2lvblBhdGgsIGRpcm5hbWUpO1xyXG59XHJcbiJdfQ==