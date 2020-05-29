'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.command = exports.description = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createPage = createPage;

var _errorHandler = require('../../services/error-handler');

var _extension = require('../../services/extension');

var _page = require('../../services/page');

var _extensionTemplate = require('../../services/extension-template');

var _diff = require('../../services/diff');

const description = exports.description = 'Add a settings page to current extension';
const command = exports.command = 'add [name]';

const handler = exports.handler = args => (0, _errorHandler.executeAndHandleError)(async () => {
  const extJson = await (0, _extension.loadExtensionJson)();
  const answers = await (0, _page.askPageCreationQuestions)(_extends({}, extJson, { defaultName: args.name }));
  await createPage(answers, (0, _extension.ensureInExtensionDir)());
});

async function createPage(opts, extensionPath) {
  const changes = await (0, _extensionTemplate.instantiateExtensionTemplate)('settings-page', _extends({}, opts, { extensionPath }));
  await (0, _diff.offerChanges)(changes);
  console.log('Success'.green.bold);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvcGFnZS9hZGQuanMiXSwibmFtZXMiOlsiY3JlYXRlUGFnZSIsImRlc2NyaXB0aW9uIiwiY29tbWFuZCIsImhhbmRsZXIiLCJhcmdzIiwiZXh0SnNvbiIsImFuc3dlcnMiLCJkZWZhdWx0TmFtZSIsIm5hbWUiLCJvcHRzIiwiZXh0ZW5zaW9uUGF0aCIsImNoYW5nZXMiLCJjb25zb2xlIiwibG9nIiwiZ3JlZW4iLCJib2xkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFlc0JBLFUsR0FBQUEsVTs7QUFmdEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRU8sTUFBTUMsb0NBQWMsMENBQXBCO0FBQ0EsTUFBTUMsNEJBQVUsWUFBaEI7O0FBRUEsTUFBTUMsNEJBQVVDLFFBQVEseUNBQXNCLFlBQVk7QUFDL0QsUUFBTUMsVUFBVSxNQUFNLG1DQUF0QjtBQUNBLFFBQU1DLFVBQVUsTUFBTSxpREFBOEJELE9BQTlCLElBQXVDRSxhQUFhSCxLQUFLSSxJQUF6RCxJQUF0QjtBQUNBLFFBQU1SLFdBQVdNLE9BQVgsRUFBb0Isc0NBQXBCLENBQU47QUFDRCxDQUo4QixDQUF4Qjs7QUFNQSxlQUFlTixVQUFmLENBQTBCUyxJQUExQixFQUFnQ0MsYUFBaEMsRUFBK0M7QUFDcEQsUUFBTUMsVUFBVSxNQUFNLHFEQUE2QixlQUE3QixlQUFtREYsSUFBbkQsSUFBeURDLGFBQXpELElBQXRCO0FBQ0EsUUFBTSx3QkFBYUMsT0FBYixDQUFOO0FBQ0FDLFVBQVFDLEdBQVIsQ0FBWSxVQUFVQyxLQUFWLENBQWdCQyxJQUE1QjtBQUNEIiwiZmlsZSI6ImFkZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWN1dGVBbmRIYW5kbGVFcnJvciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Vycm9yLWhhbmRsZXInO1xyXG5pbXBvcnQge2Vuc3VyZUluRXh0ZW5zaW9uRGlyLCBsb2FkRXh0ZW5zaW9uSnNvbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXh0ZW5zaW9uJztcclxuaW1wb3J0IHthc2tQYWdlQ3JlYXRpb25RdWVzdGlvbnN9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9wYWdlXCI7XHJcbmltcG9ydCB7aW5zdGFudGlhdGVFeHRlbnNpb25UZW1wbGF0ZX0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2V4dGVuc2lvbi10ZW1wbGF0ZVwiO1xyXG5pbXBvcnQge29mZmVyQ2hhbmdlc30gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2RpZmZcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdBZGQgYSBzZXR0aW5ncyBwYWdlIHRvIGN1cnJlbnQgZXh0ZW5zaW9uJztcclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAnYWRkIFtuYW1lXSc7XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFyZ3MgPT4gZXhlY3V0ZUFuZEhhbmRsZUVycm9yKGFzeW5jICgpID0+IHtcclxuICBjb25zdCBleHRKc29uID0gYXdhaXQgbG9hZEV4dGVuc2lvbkpzb24oKTtcclxuICBjb25zdCBhbnN3ZXJzID0gYXdhaXQgYXNrUGFnZUNyZWF0aW9uUXVlc3Rpb25zKHsgLi4uZXh0SnNvbiwgZGVmYXVsdE5hbWU6IGFyZ3MubmFtZSB9KTtcclxuICBhd2FpdCBjcmVhdGVQYWdlKGFuc3dlcnMsIGVuc3VyZUluRXh0ZW5zaW9uRGlyKCkpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQYWdlKG9wdHMsIGV4dGVuc2lvblBhdGgpIHtcclxuICBjb25zdCBjaGFuZ2VzID0gYXdhaXQgaW5zdGFudGlhdGVFeHRlbnNpb25UZW1wbGF0ZSgnc2V0dGluZ3MtcGFnZScsIHsgLi4ub3B0cywgZXh0ZW5zaW9uUGF0aCB9KTtcclxuICBhd2FpdCBvZmZlckNoYW5nZXMoY2hhbmdlcyk7XHJcbiAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnLmdyZWVuLmJvbGQpO1xyXG59XHJcbiJdfQ==