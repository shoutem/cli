"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.askPageCreationQuestions = askPageCreationQuestions;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _decamelize = require("decamelize");

var _decamelize2 = _interopRequireDefault(_decamelize);

var _inquirer = require("inquirer");

var _cliParsing = require("./cli-parsing");

var _screen = require("./screen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validatePageName(name, existingPages) {
  if (!(0, _cliParsing.isVariableName)(name)) {
    return 'Settings page\'s name must be a valid js variable name';
  }
  if (_lodash2.default.find(existingPages, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createPageCreationQuestions({ pages, parentName, defaultName = 'MyPage' }) {
  return [{
    type: 'list',
    name: 'type',
    choices: ['react', 'html'],
    default: 'react',
    message: 'Settings page type:'
  }, {
    type: 'input',
    name: 'name',
    message: 'Settings page name:',
    validate: name => validatePageName(name, pages),
    default: parentName ? `${parentName}Page` : defaultName
  }, {
    type: 'input',
    name: 'title',
    default: ({ name }) => _lodash2.default.upperFirst((0, _decamelize2.default)(name, ' ')),
    message: 'Settings page title:'
  }];
}

function createPageScopeQuestions({ screens, name: extensionName }) {
  return [{
    type: 'list',
    name: 'type',
    message: 'This settings page controls settings for:',
    choices: _lodash2.default.filter([{
      name: 'an existing screen',
      value: 'existingScreen',
      include: _lodash2.default.size(screens)
    }, {
      name: 'a new screen (creates a screen)',
      value: 'newScreen',
      include: true
    }, {
      name: `the '${extensionName}' extension`,
      value: 'extension',
      include: true
    }, {
      name: 'skip',
      value: 'skip',
      include: true
    }], 'include')
  }];
}

function createScreenSelectionQuestions({ screens }) {
  return {
    type: 'list',
    name: 'existingScreenName',
    message: 'Select existing screen:',
    choices: _lodash2.default.map(screens, 'name')
  };
}

async function askPageCreationQuestions(opts) {
  const page = await (0, _inquirer.prompt)(createPageCreationQuestions(opts));
  const parentName = page.name;

  const scope = await (0, _inquirer.prompt)(createPageScopeQuestions(opts));

  if (scope.type === 'existingScreen') {
    _lodash2.default.merge(page, (await (0, _inquirer.prompt)(createScreenSelectionQuestions(opts))));
  }

  if (scope.type === 'newScreen') {
    page.newScreen = await (0, _screen.askScreenCreationQuestions)({ opts, parentName });
  }

  if (scope.type === 'extension') {
    page.extensionScope = true;
  }

  return page;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wYWdlLmpzIl0sIm5hbWVzIjpbImFza1BhZ2VDcmVhdGlvblF1ZXN0aW9ucyIsInZhbGlkYXRlUGFnZU5hbWUiLCJuYW1lIiwiZXhpc3RpbmdQYWdlcyIsIl8iLCJmaW5kIiwiY3JlYXRlUGFnZUNyZWF0aW9uUXVlc3Rpb25zIiwicGFnZXMiLCJwYXJlbnROYW1lIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwiY2hvaWNlcyIsImRlZmF1bHQiLCJtZXNzYWdlIiwidmFsaWRhdGUiLCJ1cHBlckZpcnN0IiwiY3JlYXRlUGFnZVNjb3BlUXVlc3Rpb25zIiwic2NyZWVucyIsImV4dGVuc2lvbk5hbWUiLCJmaWx0ZXIiLCJ2YWx1ZSIsImluY2x1ZGUiLCJzaXplIiwiY3JlYXRlU2NyZWVuU2VsZWN0aW9uUXVlc3Rpb25zIiwibWFwIiwib3B0cyIsInBhZ2UiLCJzY29wZSIsIm1lcmdlIiwibmV3U2NyZWVuIiwiZXh0ZW5zaW9uU2NvcGUiXSwibWFwcGluZ3MiOiI7Ozs7O1FBdUVzQkEsd0IsR0FBQUEsd0I7O0FBdkV0Qjs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxTQUFTQyxnQkFBVCxDQUEwQkMsSUFBMUIsRUFBZ0NDLGFBQWhDLEVBQStDO0FBQzdDLE1BQUksQ0FBQyxnQ0FBZUQsSUFBZixDQUFMLEVBQTJCO0FBQ3pCLFdBQU8sd0RBQVA7QUFDRDtBQUNELE1BQUlFLGlCQUFFQyxJQUFGLENBQU9GLGFBQVAsRUFBc0IsRUFBRUQsSUFBRixFQUF0QixDQUFKLEVBQXFDO0FBQ25DLFdBQVEsR0FBRUEsSUFBSyxpQkFBZjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0ksMkJBQVQsQ0FBcUMsRUFBRUMsS0FBRixFQUFTQyxVQUFULEVBQXFCQyxjQUFjLFFBQW5DLEVBQXJDLEVBQW9GO0FBQ2xGLFNBQU8sQ0FBQztBQUNOQyxVQUFNLE1BREE7QUFFTlIsVUFBTSxNQUZBO0FBR05TLGFBQVMsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUhIO0FBSU5DLGFBQVMsT0FKSDtBQUtOQyxhQUFTO0FBTEgsR0FBRCxFQU1KO0FBQ0RILFVBQU0sT0FETDtBQUVEUixVQUFNLE1BRkw7QUFHRFcsYUFBUyxxQkFIUjtBQUlEQyxjQUFVWixRQUFRRCxpQkFBaUJDLElBQWpCLEVBQXVCSyxLQUF2QixDQUpqQjtBQUtESyxhQUFTSixhQUFjLEdBQUVBLFVBQVcsTUFBM0IsR0FBbUNDO0FBTDNDLEdBTkksRUFZSjtBQUNEQyxVQUFNLE9BREw7QUFFRFIsVUFBTSxPQUZMO0FBR0RVLGFBQVMsQ0FBQyxFQUFFVixJQUFGLEVBQUQsS0FBY0UsaUJBQUVXLFVBQUYsQ0FBYSwwQkFBV2IsSUFBWCxFQUFpQixHQUFqQixDQUFiLENBSHRCO0FBSURXLGFBQVM7QUFKUixHQVpJLENBQVA7QUFrQkQ7O0FBRUQsU0FBU0csd0JBQVQsQ0FBa0MsRUFBRUMsT0FBRixFQUFXZixNQUFNZ0IsYUFBakIsRUFBbEMsRUFBb0U7QUFDbEUsU0FBTyxDQUFDO0FBQ05SLFVBQU0sTUFEQTtBQUVOUixVQUFNLE1BRkE7QUFHTlcsYUFBUywyQ0FISDtBQUlORixhQUFTUCxpQkFBRWUsTUFBRixDQUFTLENBQUM7QUFDakJqQixZQUFNLG9CQURXO0FBRWpCa0IsYUFBTyxnQkFGVTtBQUdqQkMsZUFBU2pCLGlCQUFFa0IsSUFBRixDQUFPTCxPQUFQO0FBSFEsS0FBRCxFQUlmO0FBQ0RmLFlBQU0saUNBREw7QUFFRGtCLGFBQU8sV0FGTjtBQUdEQyxlQUFTO0FBSFIsS0FKZSxFQVFmO0FBQ0RuQixZQUFPLFFBQU9nQixhQUFjLGFBRDNCO0FBRURFLGFBQU8sV0FGTjtBQUdEQyxlQUFTO0FBSFIsS0FSZSxFQVlmO0FBQ0RuQixZQUFNLE1BREw7QUFFRGtCLGFBQU8sTUFGTjtBQUdEQyxlQUFTO0FBSFIsS0FaZSxDQUFULEVBZ0JMLFNBaEJLO0FBSkgsR0FBRCxDQUFQO0FBc0JEOztBQUVELFNBQVNFLDhCQUFULENBQXdDLEVBQUVOLE9BQUYsRUFBeEMsRUFBcUQ7QUFDbkQsU0FBTztBQUNMUCxVQUFNLE1BREQ7QUFFTFIsVUFBTSxvQkFGRDtBQUdMVyxhQUFTLHlCQUhKO0FBSUxGLGFBQVNQLGlCQUFFb0IsR0FBRixDQUFNUCxPQUFOLEVBQWUsTUFBZjtBQUpKLEdBQVA7QUFNRDs7QUFFTSxlQUFlakIsd0JBQWYsQ0FBd0N5QixJQUF4QyxFQUE4QztBQUNuRCxRQUFNQyxPQUFPLE1BQU0sc0JBQU9wQiw0QkFBNEJtQixJQUE1QixDQUFQLENBQW5CO0FBQ0EsUUFBTWpCLGFBQWFrQixLQUFLeEIsSUFBeEI7O0FBRUEsUUFBTXlCLFFBQVEsTUFBTSxzQkFBT1gseUJBQXlCUyxJQUF6QixDQUFQLENBQXBCOztBQUVBLE1BQUlFLE1BQU1qQixJQUFOLEtBQWUsZ0JBQW5CLEVBQXFDO0FBQ25DTixxQkFBRXdCLEtBQUYsQ0FBUUYsSUFBUixHQUFjLE1BQU0sc0JBQU9ILCtCQUErQkUsSUFBL0IsQ0FBUCxDQUFwQjtBQUNEOztBQUVELE1BQUlFLE1BQU1qQixJQUFOLEtBQWUsV0FBbkIsRUFBZ0M7QUFDOUJnQixTQUFLRyxTQUFMLEdBQWlCLE1BQU0sd0NBQTJCLEVBQUVKLElBQUYsRUFBUWpCLFVBQVIsRUFBM0IsQ0FBdkI7QUFDRDs7QUFFRCxNQUFJbUIsTUFBTWpCLElBQU4sS0FBZSxXQUFuQixFQUFnQztBQUM5QmdCLFNBQUtJLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDs7QUFFRCxTQUFPSixJQUFQO0FBQ0QiLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWNhbWVsaXplIGZyb20gXCJkZWNhbWVsaXplXCI7XHJcbmltcG9ydCB7IHByb21wdCB9IGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge2lzVmFyaWFibGVOYW1lfSBmcm9tIFwiLi9jbGktcGFyc2luZ1wiO1xyXG5pbXBvcnQgeyBhc2tTY3JlZW5DcmVhdGlvblF1ZXN0aW9ucyB9IGZyb20gXCIuL3NjcmVlblwiO1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVQYWdlTmFtZShuYW1lLCBleGlzdGluZ1BhZ2VzKSB7XHJcbiAgaWYgKCFpc1ZhcmlhYmxlTmFtZShuYW1lKSkge1xyXG4gICAgcmV0dXJuICdTZXR0aW5ncyBwYWdlXFwncyBuYW1lIG11c3QgYmUgYSB2YWxpZCBqcyB2YXJpYWJsZSBuYW1lJztcclxuICB9XHJcbiAgaWYgKF8uZmluZChleGlzdGluZ1BhZ2VzLCB7IG5hbWUgfSkpIHtcclxuICAgIHJldHVybiBgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2A7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYWdlQ3JlYXRpb25RdWVzdGlvbnMoeyBwYWdlcywgcGFyZW50TmFtZSwgZGVmYXVsdE5hbWUgPSAnTXlQYWdlJyB9KSB7XHJcbiAgcmV0dXJuIFt7XHJcbiAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICBuYW1lOiAndHlwZScsXHJcbiAgICBjaG9pY2VzOiBbJ3JlYWN0JywgJ2h0bWwnXSxcclxuICAgIGRlZmF1bHQ6ICdyZWFjdCcsXHJcbiAgICBtZXNzYWdlOiAnU2V0dGluZ3MgcGFnZSB0eXBlOicsXHJcbiAgfSwge1xyXG4gICAgdHlwZTogJ2lucHV0JyxcclxuICAgIG5hbWU6ICduYW1lJyxcclxuICAgIG1lc3NhZ2U6ICdTZXR0aW5ncyBwYWdlIG5hbWU6JyxcclxuICAgIHZhbGlkYXRlOiBuYW1lID0+IHZhbGlkYXRlUGFnZU5hbWUobmFtZSwgcGFnZXMpLFxyXG4gICAgZGVmYXVsdDogcGFyZW50TmFtZSA/IGAke3BhcmVudE5hbWV9UGFnZWAgOiBkZWZhdWx0TmFtZSxcclxuICB9LCB7XHJcbiAgICB0eXBlOiAnaW5wdXQnLFxyXG4gICAgbmFtZTogJ3RpdGxlJyxcclxuICAgIGRlZmF1bHQ6ICh7IG5hbWUgfSkgPT4gXy51cHBlckZpcnN0KGRlY2FtZWxpemUobmFtZSwgJyAnKSksXHJcbiAgICBtZXNzYWdlOiAnU2V0dGluZ3MgcGFnZSB0aXRsZTonLFxyXG4gIH1dO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYWdlU2NvcGVRdWVzdGlvbnMoeyBzY3JlZW5zLCBuYW1lOiBleHRlbnNpb25OYW1lIH0pIHtcclxuICByZXR1cm4gW3tcclxuICAgIHR5cGU6ICdsaXN0JyxcclxuICAgIG5hbWU6ICd0eXBlJyxcclxuICAgIG1lc3NhZ2U6ICdUaGlzIHNldHRpbmdzIHBhZ2UgY29udHJvbHMgc2V0dGluZ3MgZm9yOicsXHJcbiAgICBjaG9pY2VzOiBfLmZpbHRlcihbe1xyXG4gICAgICBuYW1lOiAnYW4gZXhpc3Rpbmcgc2NyZWVuJyxcclxuICAgICAgdmFsdWU6ICdleGlzdGluZ1NjcmVlbicsXHJcbiAgICAgIGluY2x1ZGU6IF8uc2l6ZShzY3JlZW5zKSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ2EgbmV3IHNjcmVlbiAoY3JlYXRlcyBhIHNjcmVlbiknLFxyXG4gICAgICB2YWx1ZTogJ25ld1NjcmVlbicsXHJcbiAgICAgIGluY2x1ZGU6IHRydWUsXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6IGB0aGUgJyR7ZXh0ZW5zaW9uTmFtZX0nIGV4dGVuc2lvbmAsXHJcbiAgICAgIHZhbHVlOiAnZXh0ZW5zaW9uJyxcclxuICAgICAgaW5jbHVkZTogdHJ1ZSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ3NraXAnLFxyXG4gICAgICB2YWx1ZTogJ3NraXAnLFxyXG4gICAgICBpbmNsdWRlOiB0cnVlLFxyXG4gICAgfV0sICdpbmNsdWRlJyksXHJcbiAgfV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNjcmVlblNlbGVjdGlvblF1ZXN0aW9ucyh7IHNjcmVlbnMgfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICBuYW1lOiAnZXhpc3RpbmdTY3JlZW5OYW1lJyxcclxuICAgIG1lc3NhZ2U6ICdTZWxlY3QgZXhpc3Rpbmcgc2NyZWVuOicsXHJcbiAgICBjaG9pY2VzOiBfLm1hcChzY3JlZW5zLCAnbmFtZScpLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc2tQYWdlQ3JlYXRpb25RdWVzdGlvbnMob3B0cykge1xyXG4gIGNvbnN0IHBhZ2UgPSBhd2FpdCBwcm9tcHQoY3JlYXRlUGFnZUNyZWF0aW9uUXVlc3Rpb25zKG9wdHMpKTtcclxuICBjb25zdCBwYXJlbnROYW1lID0gcGFnZS5uYW1lO1xyXG5cclxuICBjb25zdCBzY29wZSA9IGF3YWl0IHByb21wdChjcmVhdGVQYWdlU2NvcGVRdWVzdGlvbnMob3B0cykpO1xyXG5cclxuICBpZiAoc2NvcGUudHlwZSA9PT0gJ2V4aXN0aW5nU2NyZWVuJykge1xyXG4gICAgXy5tZXJnZShwYWdlLCBhd2FpdCBwcm9tcHQoY3JlYXRlU2NyZWVuU2VsZWN0aW9uUXVlc3Rpb25zKG9wdHMpKSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc2NvcGUudHlwZSA9PT0gJ25ld1NjcmVlbicpIHtcclxuICAgIHBhZ2UubmV3U2NyZWVuID0gYXdhaXQgYXNrU2NyZWVuQ3JlYXRpb25RdWVzdGlvbnMoeyBvcHRzLCBwYXJlbnROYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNjb3BlLnR5cGUgPT09ICdleHRlbnNpb24nKSB7XHJcbiAgICBwYWdlLmV4dGVuc2lvblNjb3BlID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwYWdlO1xyXG59XHJcbiJdfQ==