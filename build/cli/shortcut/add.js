"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.command = exports.description = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createShortcut = createShortcut;

var _errorHandler = require("../../services/error-handler");

var _shortcut = require("../../services/shortcut");

var _extension = require("../../services/extension");

var _extensionTemplate = require("../../services/extension-template");

var _diff = require("../../services/diff");

const description = exports.description = 'Add an application shortcut';
const command = exports.command = 'add [name]';
const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(async () => {
  const extJson = await (0, _extension.loadExtensionJson)();
  const answers = await (0, _shortcut.askShortcutCreationQuestions)(_extends({}, extJson, { defaultName: args.name }));
  await createShortcut(answers, (0, _extension.ensureInExtensionDir)());
});

async function createShortcut(answers, extensionPath) {
  await (0, _diff.offerChanges)((await (0, _extensionTemplate.instantiateExtensionTemplate)('shortcut', _extends({}, answers, { extensionPath }))));
  console.log('Success!'.bold.green);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvc2hvcnRjdXQvYWRkLmpzIl0sIm5hbWVzIjpbImNyZWF0ZVNob3J0Y3V0IiwiZGVzY3JpcHRpb24iLCJjb21tYW5kIiwiaGFuZGxlciIsImFyZ3MiLCJleHRKc29uIiwiYW5zd2VycyIsImRlZmF1bHROYW1lIiwibmFtZSIsImV4dGVuc2lvblBhdGgiLCJjb25zb2xlIiwibG9nIiwiYm9sZCIsImdyZWVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFjc0JBLGMsR0FBQUEsYzs7QUFkdEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRU8sTUFBTUMsb0NBQWMsNkJBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsWUFBaEI7QUFDQSxNQUFNQyw0QkFBVUMsUUFBUSx5Q0FBc0IsWUFBWTtBQUMvRCxRQUFNQyxVQUFVLE1BQU0sbUNBQXRCO0FBQ0EsUUFBTUMsVUFBVSxNQUFNLHlEQUFrQ0QsT0FBbEMsSUFBMkNFLGFBQWFILEtBQUtJLElBQTdELElBQXRCO0FBQ0EsUUFBTVIsZUFBZU0sT0FBZixFQUF3QixzQ0FBeEIsQ0FBTjtBQUNELENBSjhCLENBQXhCOztBQU1BLGVBQWVOLGNBQWYsQ0FBOEJNLE9BQTlCLEVBQXVDRyxhQUF2QyxFQUFzRDtBQUMzRCxRQUFNLHlCQUFhLE1BQU0scURBQTZCLFVBQTdCLGVBQThDSCxPQUE5QyxJQUF1REcsYUFBdkQsSUFBbkIsRUFBTjtBQUNBQyxVQUFRQyxHQUFSLENBQVksV0FBV0MsSUFBWCxDQUFnQkMsS0FBNUI7QUFDRCIsImZpbGUiOiJhZGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN1dGVBbmRIYW5kbGVFcnJvcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXJyb3ItaGFuZGxlcic7XHJcbmltcG9ydCB7YXNrU2hvcnRjdXRDcmVhdGlvblF1ZXN0aW9uc30gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL3Nob3J0Y3V0XCI7XHJcbmltcG9ydCB7ZW5zdXJlSW5FeHRlbnNpb25EaXIsIGxvYWRFeHRlbnNpb25Kc29ufSBmcm9tIFwiLi4vLi4vc2VydmljZXMvZXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7aW5zdGFudGlhdGVFeHRlbnNpb25UZW1wbGF0ZX0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2V4dGVuc2lvbi10ZW1wbGF0ZVwiO1xyXG5pbXBvcnQge29mZmVyQ2hhbmdlc30gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2RpZmZcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdBZGQgYW4gYXBwbGljYXRpb24gc2hvcnRjdXQnO1xyXG5leHBvcnQgY29uc3QgY29tbWFuZCA9ICdhZGQgW25hbWVdJztcclxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhcmdzID0+IGV4ZWN1dGVBbmRIYW5kbGVFcnJvcihhc3luYyAoKSA9PiB7XHJcbiAgY29uc3QgZXh0SnNvbiA9IGF3YWl0IGxvYWRFeHRlbnNpb25Kc29uKCk7XHJcbiAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGFza1Nob3J0Y3V0Q3JlYXRpb25RdWVzdGlvbnMoeyAuLi5leHRKc29uLCBkZWZhdWx0TmFtZTogYXJncy5uYW1lIH0pO1xyXG4gIGF3YWl0IGNyZWF0ZVNob3J0Y3V0KGFuc3dlcnMsIGVuc3VyZUluRXh0ZW5zaW9uRGlyKCkpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTaG9ydGN1dChhbnN3ZXJzLCBleHRlbnNpb25QYXRoKSB7XHJcbiAgYXdhaXQgb2ZmZXJDaGFuZ2VzKGF3YWl0IGluc3RhbnRpYXRlRXh0ZW5zaW9uVGVtcGxhdGUoJ3Nob3J0Y3V0JywgeyAuLi5hbnN3ZXJzLCBleHRlbnNpb25QYXRoIH0pKTtcclxuICBjb25zb2xlLmxvZygnU3VjY2VzcyEnLmJvbGQuZ3JlZW4pO1xyXG59XHJcbiJdfQ==