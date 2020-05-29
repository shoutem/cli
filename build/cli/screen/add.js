"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.command = exports.description = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createScreen = createScreen;

var _errorHandler = require("../../services/error-handler");

var _extension = require("../../services/extension");

var _screen = require("../../services/screen");

var _extensionTemplate = require("../../services/extension-template");

var _diff = require("../../services/diff");

const description = exports.description = 'Add a screen for applications running this extension';
const command = exports.command = 'add [name]';

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(async () => {
  const extJson = await (0, _extension.loadExtensionJson)();
  const answers = await (0, _screen.askScreenCreationQuestions)(_extends({}, extJson, { defaultName: args.name }));
  await createScreen(answers, (0, _extension.ensureInExtensionDir)());
});

async function createScreen(opts, extensionPath) {
  await (0, _diff.offerChanges)((await (0, _extensionTemplate.instantiateExtensionTemplate)('screen', _extends({}, opts, { extensionPath }))));
  console.log('Success'.green.bold);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvc2NyZWVuL2FkZC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVTY3JlZW4iLCJkZXNjcmlwdGlvbiIsImNvbW1hbmQiLCJoYW5kbGVyIiwiYXJncyIsImV4dEpzb24iLCJhbnN3ZXJzIiwiZGVmYXVsdE5hbWUiLCJuYW1lIiwib3B0cyIsImV4dGVuc2lvblBhdGgiLCJjb25zb2xlIiwibG9nIiwiZ3JlZW4iLCJib2xkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFlc0JBLFksR0FBQUEsWTs7QUFmdEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRU8sTUFBTUMsb0NBQWMsc0RBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsWUFBaEI7O0FBRUEsTUFBTUMsNEJBQVVDLFFBQVEseUNBQXNCLFlBQVk7QUFDL0QsUUFBTUMsVUFBVSxNQUFNLG1DQUF0QjtBQUNBLFFBQU1DLFVBQVUsTUFBTSxxREFBZ0NELE9BQWhDLElBQXlDRSxhQUFhSCxLQUFLSSxJQUEzRCxJQUF0QjtBQUNBLFFBQU1SLGFBQWFNLE9BQWIsRUFBc0Isc0NBQXRCLENBQU47QUFDRCxDQUo4QixDQUF4Qjs7QUFNQSxlQUFlTixZQUFmLENBQTRCUyxJQUE1QixFQUFrQ0MsYUFBbEMsRUFBaUQ7QUFDdEQsUUFBTSx5QkFBYSxNQUFNLHFEQUE2QixRQUE3QixlQUE0Q0QsSUFBNUMsSUFBa0RDLGFBQWxELElBQW5CLEVBQU47QUFDQUMsVUFBUUMsR0FBUixDQUFZLFVBQVVDLEtBQVYsQ0FBZ0JDLElBQTVCO0FBQ0QiLCJmaWxlIjoiYWRkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY3V0ZUFuZEhhbmRsZUVycm9yIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcbmltcG9ydCB7ZW5zdXJlSW5FeHRlbnNpb25EaXIsIGxvYWRFeHRlbnNpb25Kc29ufSBmcm9tIFwiLi4vLi4vc2VydmljZXMvZXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7YXNrU2NyZWVuQ3JlYXRpb25RdWVzdGlvbnN9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9zY3JlZW5cIjtcclxuaW1wb3J0IHtpbnN0YW50aWF0ZUV4dGVuc2lvblRlbXBsYXRlfSBmcm9tIFwiLi4vLi4vc2VydmljZXMvZXh0ZW5zaW9uLXRlbXBsYXRlXCI7XHJcbmltcG9ydCB7b2ZmZXJDaGFuZ2VzfSBmcm9tIFwiLi4vLi4vc2VydmljZXMvZGlmZlwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0FkZCBhIHNjcmVlbiBmb3IgYXBwbGljYXRpb25zIHJ1bm5pbmcgdGhpcyBleHRlbnNpb24nO1xyXG5leHBvcnQgY29uc3QgY29tbWFuZCA9ICdhZGQgW25hbWVdJztcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXJncyA9PiBleGVjdXRlQW5kSGFuZGxlRXJyb3IoYXN5bmMgKCkgPT4ge1xyXG4gIGNvbnN0IGV4dEpzb24gPSBhd2FpdCBsb2FkRXh0ZW5zaW9uSnNvbigpO1xyXG4gIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBhc2tTY3JlZW5DcmVhdGlvblF1ZXN0aW9ucyh7IC4uLmV4dEpzb24sIGRlZmF1bHROYW1lOiBhcmdzLm5hbWUgfSk7XHJcbiAgYXdhaXQgY3JlYXRlU2NyZWVuKGFuc3dlcnMsIGVuc3VyZUluRXh0ZW5zaW9uRGlyKCkpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTY3JlZW4ob3B0cywgZXh0ZW5zaW9uUGF0aCkge1xyXG4gIGF3YWl0IG9mZmVyQ2hhbmdlcyhhd2FpdCBpbnN0YW50aWF0ZUV4dGVuc2lvblRlbXBsYXRlKCdzY3JlZW4nLCB7IC4uLm9wdHMsIGV4dGVuc2lvblBhdGggfSkpO1xyXG4gIGNvbnNvbGUubG9nKCdTdWNjZXNzJy5ncmVlbi5ib2xkKTtcclxufVxyXG4iXX0=