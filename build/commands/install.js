'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promptCreateNewApp = promptCreateNewApp;
exports.promptAppName = promptAppName;
exports.ensureApp = ensureApp;
exports.createNewApp = createNewApp;
exports.installLocalExtension = installLocalExtension;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _appManager = require('../clients/app-manager');

var _legacyService = require('../clients/legacy-service');

var _localExtensions = require('../clients/local-extensions');

var _extensionManager = require('../clients/extension-manager');

var extensionManager = _interopRequireWildcard(_extensionManager);

var _appSelector = require('../services/app-selector');

var _appSelector2 = _interopRequireDefault(_appSelector);

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _extension = require('../services/extension');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function promptCreateNewApp() {
  const { answerNew } = await _inquirer2.default.prompt({
    type: 'list',
    name: 'createNew',
    message: 'You have no apps. Create a new one?',
    choices: ['yes', 'no']
  });

  return answerNew === 'yes';
}

async function promptAppName() {
  const { appName } = await _inquirer2.default.prompt({
    name: 'appName',
    message: 'App name',
    default: 'MyApp'
  });

  return appName;
}

async function getNewApp() {
  const name = await promptAppName();
  return await (0, _appManager.createApp)({ name });
}

async function ensureApp() {
  const appList = await (0, _legacyService.getLatestApps)();

  if (appList.length === 0) {
    if (!(await promptCreateNewApp())) {
      return await getNewApp();
    }
  }

  const appId = await (0, _appSelector2.default)(appList);
  return appList.filter(app => app.id === appId)[0] || (await getNewApp());
}

async function createNewApp(name) {
  return await (0, _appManager.createApp)({ name });
}

async function installLocalExtension(appId, extensionRoot = (0, _extension.ensureInExtensionDir)()) {
  const canonicalName = await (0, _localExtensions.getExtensionCanonicalName)(extensionRoot);
  const extensionId = await extensionManager.getExtensionId(canonicalName);

  if (extensionId) {
    await (0, _appManager.installExtension)(appId, extensionId);
  } else {
    throw new Error(_user_messages2.default.install.notExtensionDir());
  }

  return extensionId;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbnN0YWxsLmpzIl0sIm5hbWVzIjpbInByb21wdENyZWF0ZU5ld0FwcCIsInByb21wdEFwcE5hbWUiLCJlbnN1cmVBcHAiLCJjcmVhdGVOZXdBcHAiLCJpbnN0YWxsTG9jYWxFeHRlbnNpb24iLCJleHRlbnNpb25NYW5hZ2VyIiwiYW5zd2VyTmV3IiwiaW5xdWlyZXIiLCJwcm9tcHQiLCJ0eXBlIiwibmFtZSIsIm1lc3NhZ2UiLCJjaG9pY2VzIiwiYXBwTmFtZSIsImRlZmF1bHQiLCJnZXROZXdBcHAiLCJhcHBMaXN0IiwibGVuZ3RoIiwiYXBwSWQiLCJmaWx0ZXIiLCJhcHAiLCJpZCIsImV4dGVuc2lvblJvb3QiLCJjYW5vbmljYWxOYW1lIiwiZXh0ZW5zaW9uSWQiLCJnZXRFeHRlbnNpb25JZCIsIkVycm9yIiwibXNnIiwiaW5zdGFsbCIsIm5vdEV4dGVuc2lvbkRpciJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFTc0JBLGtCLEdBQUFBLGtCO1FBV0FDLGEsR0FBQUEsYTtRQWVBQyxTLEdBQUFBLFM7UUFhQUMsWSxHQUFBQSxZO1FBSUFDLHFCLEdBQUFBLHFCOztBQXBEdEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7SUFBWUMsZ0I7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxlQUFlTCxrQkFBZixHQUFvQztBQUN6QyxRQUFNLEVBQUVNLFNBQUYsS0FBZ0IsTUFBTUMsbUJBQVNDLE1BQVQsQ0FBZ0I7QUFDMUNDLFVBQU0sTUFEb0M7QUFFMUNDLFVBQU0sV0FGb0M7QUFHMUNDLGFBQVMscUNBSGlDO0FBSTFDQyxhQUFTLENBQUMsS0FBRCxFQUFRLElBQVI7QUFKaUMsR0FBaEIsQ0FBNUI7O0FBT0EsU0FBT04sY0FBYyxLQUFyQjtBQUNEOztBQUVNLGVBQWVMLGFBQWYsR0FBK0I7QUFDcEMsUUFBTSxFQUFFWSxPQUFGLEtBQWMsTUFBTU4sbUJBQVNDLE1BQVQsQ0FBZ0I7QUFDeENFLFVBQU0sU0FEa0M7QUFFeENDLGFBQVMsVUFGK0I7QUFHeENHLGFBQVM7QUFIK0IsR0FBaEIsQ0FBMUI7O0FBTUEsU0FBT0QsT0FBUDtBQUNEOztBQUVELGVBQWVFLFNBQWYsR0FBMkI7QUFDekIsUUFBTUwsT0FBTyxNQUFNVCxlQUFuQjtBQUNBLFNBQU8sTUFBTSwyQkFBVSxFQUFFUyxJQUFGLEVBQVYsQ0FBYjtBQUNEOztBQUVNLGVBQWVSLFNBQWYsR0FBMkI7QUFDaEMsUUFBTWMsVUFBVSxNQUFNLG1DQUF0Qjs7QUFFQSxNQUFJQSxRQUFRQyxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLFFBQUksRUFBQyxNQUFNakIsb0JBQVAsQ0FBSixFQUFpQztBQUMvQixhQUFPLE1BQU1lLFdBQWI7QUFDRDtBQUNGOztBQUVELFFBQU1HLFFBQVEsTUFBTSwyQkFBVUYsT0FBVixDQUFwQjtBQUNBLFNBQU9BLFFBQVFHLE1BQVIsQ0FBZUMsT0FBT0EsSUFBSUMsRUFBSixLQUFXSCxLQUFqQyxFQUF3QyxDQUF4QyxNQUE4QyxNQUFNSCxXQUFwRCxDQUFQO0FBQ0Q7O0FBRU0sZUFBZVosWUFBZixDQUE0Qk8sSUFBNUIsRUFBa0M7QUFDdkMsU0FBTyxNQUFNLDJCQUFVLEVBQUVBLElBQUYsRUFBVixDQUFiO0FBQ0Q7O0FBRU0sZUFBZU4scUJBQWYsQ0FBcUNjLEtBQXJDLEVBQTRDSSxnQkFBZ0Isc0NBQTVELEVBQW9GO0FBQ3pGLFFBQU1DLGdCQUFnQixNQUFNLGdEQUEwQkQsYUFBMUIsQ0FBNUI7QUFDQSxRQUFNRSxjQUFjLE1BQU1uQixpQkFBaUJvQixjQUFqQixDQUFnQ0YsYUFBaEMsQ0FBMUI7O0FBRUEsTUFBSUMsV0FBSixFQUFpQjtBQUNmLFVBQU0sa0NBQWlCTixLQUFqQixFQUF3Qk0sV0FBeEIsQ0FBTjtBQUNELEdBRkQsTUFFTztBQUNMLFVBQU0sSUFBSUUsS0FBSixDQUFVQyx3QkFBSUMsT0FBSixDQUFZQyxlQUFaLEVBQVYsQ0FBTjtBQUNEOztBQUVELFNBQU9MLFdBQVA7QUFDRCIsImZpbGUiOiJpbnN0YWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlucXVpcmVyIGZyb20gJ2lucXVpcmVyJztcclxuaW1wb3J0IHsgaW5zdGFsbEV4dGVuc2lvbiwgY3JlYXRlQXBwIH0gZnJvbSAnLi4vY2xpZW50cy9hcHAtbWFuYWdlcic7XHJcbmltcG9ydCB7IGdldExhdGVzdEFwcHMgfSBmcm9tICcuLi9jbGllbnRzL2xlZ2FjeS1zZXJ2aWNlJztcclxuaW1wb3J0IHsgZ2V0RXh0ZW5zaW9uQ2Fub25pY2FsTmFtZSB9IGZyb20gJy4uL2NsaWVudHMvbG9jYWwtZXh0ZW5zaW9ucyc7XHJcbmltcG9ydCAqIGFzIGV4dGVuc2lvbk1hbmFnZXIgZnJvbSAnLi4vY2xpZW50cy9leHRlbnNpb24tbWFuYWdlcic7XHJcbmltcG9ydCBzZWxlY3RBcHAgZnJvbSAnLi4vc2VydmljZXMvYXBwLXNlbGVjdG9yJztcclxuaW1wb3J0IG1zZyBmcm9tICcuLi91c2VyX21lc3NhZ2VzJztcclxuaW1wb3J0IHtlbnN1cmVJbkV4dGVuc2lvbkRpcn0gZnJvbSBcIi4uL3NlcnZpY2VzL2V4dGVuc2lvblwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb21wdENyZWF0ZU5ld0FwcCgpIHtcclxuICBjb25zdCB7IGFuc3dlck5ldyB9ID0gYXdhaXQgaW5xdWlyZXIucHJvbXB0KHtcclxuICAgIHR5cGU6ICdsaXN0JyxcclxuICAgIG5hbWU6ICdjcmVhdGVOZXcnLFxyXG4gICAgbWVzc2FnZTogJ1lvdSBoYXZlIG5vIGFwcHMuIENyZWF0ZSBhIG5ldyBvbmU/JyxcclxuICAgIGNob2ljZXM6IFsneWVzJywgJ25vJ10sXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBhbnN3ZXJOZXcgPT09ICd5ZXMnO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvbXB0QXBwTmFtZSgpIHtcclxuICBjb25zdCB7IGFwcE5hbWUgfSA9IGF3YWl0IGlucXVpcmVyLnByb21wdCh7XHJcbiAgICBuYW1lOiAnYXBwTmFtZScsXHJcbiAgICBtZXNzYWdlOiAnQXBwIG5hbWUnLFxyXG4gICAgZGVmYXVsdDogJ015QXBwJyxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGFwcE5hbWU7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldE5ld0FwcCgpIHtcclxuICBjb25zdCBuYW1lID0gYXdhaXQgcHJvbXB0QXBwTmFtZSgpO1xyXG4gIHJldHVybiBhd2FpdCBjcmVhdGVBcHAoeyBuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zdXJlQXBwKCkge1xyXG4gIGNvbnN0IGFwcExpc3QgPSBhd2FpdCBnZXRMYXRlc3RBcHBzKCk7XHJcblxyXG4gIGlmIChhcHBMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgaWYgKCFhd2FpdCBwcm9tcHRDcmVhdGVOZXdBcHAoKSkge1xyXG4gICAgICByZXR1cm4gYXdhaXQgZ2V0TmV3QXBwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBhcHBJZCA9IGF3YWl0IHNlbGVjdEFwcChhcHBMaXN0KTtcclxuICByZXR1cm4gYXBwTGlzdC5maWx0ZXIoYXBwID0+IGFwcC5pZCA9PT0gYXBwSWQpWzBdIHx8IGF3YWl0IGdldE5ld0FwcCgpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlTmV3QXBwKG5hbWUpIHtcclxuICByZXR1cm4gYXdhaXQgY3JlYXRlQXBwKHsgbmFtZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluc3RhbGxMb2NhbEV4dGVuc2lvbihhcHBJZCwgZXh0ZW5zaW9uUm9vdCA9IGVuc3VyZUluRXh0ZW5zaW9uRGlyKCkpIHtcclxuICBjb25zdCBjYW5vbmljYWxOYW1lID0gYXdhaXQgZ2V0RXh0ZW5zaW9uQ2Fub25pY2FsTmFtZShleHRlbnNpb25Sb290KTtcclxuICBjb25zdCBleHRlbnNpb25JZCA9IGF3YWl0IGV4dGVuc2lvbk1hbmFnZXIuZ2V0RXh0ZW5zaW9uSWQoY2Fub25pY2FsTmFtZSk7XHJcblxyXG4gIGlmIChleHRlbnNpb25JZCkge1xyXG4gICAgYXdhaXQgaW5zdGFsbEV4dGVuc2lvbihhcHBJZCwgZXh0ZW5zaW9uSWQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnLmluc3RhbGwubm90RXh0ZW5zaW9uRGlyKCkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGV4dGVuc2lvbklkO1xyXG59XHJcbiJdfQ==