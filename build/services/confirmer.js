'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _inquirer = require('inquirer');

exports.default = async function (message, opts = {}) {
  const { confirmed } = await (0, _inquirer.prompt)(_extends({
    type: 'confirm',
    message: message,
    name: 'confirmed'
  }, opts));

  return confirmed;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9jb25maXJtZXIuanMiXSwibmFtZXMiOlsibWVzc2FnZSIsIm9wdHMiLCJjb25maXJtZWQiLCJ0eXBlIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7a0JBRWUsZ0JBQWVBLE9BQWYsRUFBd0JDLE9BQU8sRUFBL0IsRUFBbUM7QUFDaEQsUUFBTSxFQUFFQyxTQUFGLEtBQWdCLE1BQU07QUFDMUJDLFVBQU0sU0FEb0I7QUFFMUJILGFBQVNBLE9BRmlCO0FBRzFCSSxVQUFNO0FBSG9CLEtBSXZCSCxJQUp1QixFQUE1Qjs7QUFPQSxTQUFPQyxTQUFQO0FBQ0QsQyIsImZpbGUiOiJjb25maXJtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9tcHQgfSBmcm9tICdpbnF1aXJlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbihtZXNzYWdlLCBvcHRzID0ge30pIHtcclxuICBjb25zdCB7IGNvbmZpcm1lZCB9ID0gYXdhaXQgcHJvbXB0KHtcclxuICAgIHR5cGU6ICdjb25maXJtJyxcclxuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICBuYW1lOiAnY29uZmlybWVkJyxcclxuICAgIC4uLm9wdHNcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGNvbmZpcm1lZDtcclxufVxyXG4iXX0=