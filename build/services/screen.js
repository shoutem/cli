"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.askScreenCreationQuestions = askScreenCreationQuestions;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require("inquirer");

var _cliParsing = require("./cli-parsing");

var _shortcut = require("./shortcut");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function validateScreenName(name, existingScreens) {
  if (!(0, _cliParsing.isVariableName)(name)) {
    return 'Screen\'s name must be a valid js variable name';
  }
  if (_lodash2.default.find(existingScreens, { name })) {
    return `${name} already exists`;
  }
  return true;
}

function createScreenCreationQuestions({ screens, parentName, defaultName = 'MyScreen' }) {
  return {
    type: 'input',
    name: 'name',
    message: 'Screen name:',
    validate: name => validateScreenName(name, screens),
    default: parentName ? `${parentName}Screen` : defaultName
  };
}

async function askScreenCreationQuestions(opts) {
  const screen = await (0, _inquirer.prompt)(createScreenCreationQuestions(opts));
  const parentName = screen.name;

  const message = "Shortcut is required for a screen to appear in the app. Create one now?";
  const _ref = await (0, _shortcut.askShortcutCreationQuestions)(_extends({}, opts, { parentName, message })),
        { shouldCreateShortcut } = _ref,
        shortcut = _objectWithoutProperties(_ref, ["shouldCreateShortcut"]);
  if (shouldCreateShortcut) {
    screen.newShortcut = shortcut;
  }

  return screen;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zY3JlZW4uanMiXSwibmFtZXMiOlsiYXNrU2NyZWVuQ3JlYXRpb25RdWVzdGlvbnMiLCJ2YWxpZGF0ZVNjcmVlbk5hbWUiLCJuYW1lIiwiZXhpc3RpbmdTY3JlZW5zIiwiXyIsImZpbmQiLCJjcmVhdGVTY3JlZW5DcmVhdGlvblF1ZXN0aW9ucyIsInNjcmVlbnMiLCJwYXJlbnROYW1lIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwibWVzc2FnZSIsInZhbGlkYXRlIiwiZGVmYXVsdCIsIm9wdHMiLCJzY3JlZW4iLCJzaG91bGRDcmVhdGVTaG9ydGN1dCIsInNob3J0Y3V0IiwibmV3U2hvcnRjdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBeUJzQkEsMEIsR0FBQUEsMEI7O0FBekJ0Qjs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxTQUFTQyxrQkFBVCxDQUE0QkMsSUFBNUIsRUFBa0NDLGVBQWxDLEVBQW1EO0FBQ2pELE1BQUksQ0FBQyxnQ0FBZUQsSUFBZixDQUFMLEVBQTJCO0FBQ3pCLFdBQU8saURBQVA7QUFDRDtBQUNELE1BQUlFLGlCQUFFQyxJQUFGLENBQU9GLGVBQVAsRUFBd0IsRUFBRUQsSUFBRixFQUF4QixDQUFKLEVBQXVDO0FBQ3JDLFdBQVEsR0FBRUEsSUFBSyxpQkFBZjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0ksNkJBQVQsQ0FBdUMsRUFBRUMsT0FBRixFQUFXQyxVQUFYLEVBQXVCQyxjQUFjLFVBQXJDLEVBQXZDLEVBQTBGO0FBQ3hGLFNBQU87QUFDTEMsVUFBTSxPQUREO0FBRUxSLFVBQU0sTUFGRDtBQUdMUyxhQUFTLGNBSEo7QUFJTEMsY0FBVVYsUUFBUUQsbUJBQW1CQyxJQUFuQixFQUF5QkssT0FBekIsQ0FKYjtBQUtMTSxhQUFTTCxhQUFjLEdBQUVBLFVBQVcsUUFBM0IsR0FBcUNDO0FBTHpDLEdBQVA7QUFPRDs7QUFFTSxlQUFlVCwwQkFBZixDQUEwQ2MsSUFBMUMsRUFBZ0Q7QUFDckQsUUFBTUMsU0FBUyxNQUFNLHNCQUFPVCw4QkFBOEJRLElBQTlCLENBQVAsQ0FBckI7QUFDQSxRQUFNTixhQUFhTyxPQUFPYixJQUExQjs7QUFFQSxRQUFNUyxVQUFVLHlFQUFoQjtBQUNBLGVBQThDLE1BQU0seURBQWtDRyxJQUFsQyxJQUF3Q04sVUFBeEMsRUFBb0RHLE9BQXBELElBQXBEO0FBQUEsUUFBTSxFQUFFSyxvQkFBRixFQUFOO0FBQUEsUUFBaUNDLFFBQWpDO0FBQ0EsTUFBSUQsb0JBQUosRUFBMEI7QUFDeEJELFdBQU9HLFdBQVAsR0FBcUJELFFBQXJCO0FBQ0Q7O0FBRUQsU0FBT0YsTUFBUDtBQUNEIiwiZmlsZSI6InNjcmVlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcclxuaW1wb3J0IHsgcHJvbXB0IH0gZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7aXNWYXJpYWJsZU5hbWV9IGZyb20gXCIuL2NsaS1wYXJzaW5nXCI7XHJcbmltcG9ydCB7YXNrU2hvcnRjdXRDcmVhdGlvblF1ZXN0aW9uc30gZnJvbSBcIi4vc2hvcnRjdXRcIjtcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlU2NyZWVuTmFtZShuYW1lLCBleGlzdGluZ1NjcmVlbnMpIHtcclxuICBpZiAoIWlzVmFyaWFibGVOYW1lKG5hbWUpKSB7XHJcbiAgICByZXR1cm4gJ1NjcmVlblxcJ3MgbmFtZSBtdXN0IGJlIGEgdmFsaWQganMgdmFyaWFibGUgbmFtZSc7XHJcbiAgfVxyXG4gIGlmIChfLmZpbmQoZXhpc3RpbmdTY3JlZW5zLCB7IG5hbWUgfSkpIHtcclxuICAgIHJldHVybiBgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2A7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTY3JlZW5DcmVhdGlvblF1ZXN0aW9ucyh7IHNjcmVlbnMsIHBhcmVudE5hbWUsIGRlZmF1bHROYW1lID0gJ015U2NyZWVuJyB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICBuYW1lOiAnbmFtZScsXHJcbiAgICBtZXNzYWdlOiAnU2NyZWVuIG5hbWU6JyxcclxuICAgIHZhbGlkYXRlOiBuYW1lID0+IHZhbGlkYXRlU2NyZWVuTmFtZShuYW1lLCBzY3JlZW5zKSxcclxuICAgIGRlZmF1bHQ6IHBhcmVudE5hbWUgPyBgJHtwYXJlbnROYW1lfVNjcmVlbmAgOiBkZWZhdWx0TmFtZSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXNrU2NyZWVuQ3JlYXRpb25RdWVzdGlvbnMob3B0cykge1xyXG4gIGNvbnN0IHNjcmVlbiA9IGF3YWl0IHByb21wdChjcmVhdGVTY3JlZW5DcmVhdGlvblF1ZXN0aW9ucyhvcHRzKSk7XHJcbiAgY29uc3QgcGFyZW50TmFtZSA9IHNjcmVlbi5uYW1lO1xyXG5cclxuICBjb25zdCBtZXNzYWdlID0gXCJTaG9ydGN1dCBpcyByZXF1aXJlZCBmb3IgYSBzY3JlZW4gdG8gYXBwZWFyIGluIHRoZSBhcHAuIENyZWF0ZSBvbmUgbm93P1wiO1xyXG4gIGNvbnN0IHsgc2hvdWxkQ3JlYXRlU2hvcnRjdXQsIC4uLnNob3J0Y3V0IH0gPSBhd2FpdCBhc2tTaG9ydGN1dENyZWF0aW9uUXVlc3Rpb25zKHsgLi4ub3B0cywgcGFyZW50TmFtZSwgbWVzc2FnZSB9KTtcclxuICBpZiAoc2hvdWxkQ3JlYXRlU2hvcnRjdXQpIHtcclxuICAgIHNjcmVlbi5uZXdTaG9ydGN1dCA9IHNob3J0Y3V0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNjcmVlbjtcclxufVxyXG4iXX0=