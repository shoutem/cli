'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.description = exports.command = undefined;

var _errorHandler = require('../services/error-handler');

var _add = require('./extension/add');

const command = exports.command = 'init <name>';
const description = exports.description = 'Create a scaffold of all files and folders required to build an extension.';
const builder = exports.builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`).strict();
};

const handler = exports.handler = ({ name }) => (0, _errorHandler.executeAndHandleError)(async () => {
  await (0, _add.addExtension)({ name, externalDestination: process.cwd() });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5pdC5qcyJdLCJuYW1lcyI6WyJjb21tYW5kIiwiZGVzY3JpcHRpb24iLCJidWlsZGVyIiwieWFyZ3MiLCJ1c2FnZSIsInN0cmljdCIsImhhbmRsZXIiLCJuYW1lIiwiZXh0ZXJuYWxEZXN0aW5hdGlvbiIsInByb2Nlc3MiLCJjd2QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFTyxNQUFNQSw0QkFBVSxhQUFoQjtBQUNBLE1BQU1DLG9DQUFjLDRFQUFwQjtBQUNBLE1BQU1DLDRCQUFVQyxTQUFTO0FBQzlCLFNBQU9BLE1BQU1DLEtBQU4sQ0FBYSxXQUFVSixPQUFRLE9BQU1DLFdBQVksRUFBakQsRUFBb0RJLE1BQXBELEVBQVA7QUFDRCxDQUZNOztBQUlBLE1BQU1DLDRCQUFVLENBQUMsRUFBRUMsSUFBRixFQUFELEtBQWMseUNBQXNCLFlBQVk7QUFDckUsUUFBTSx1QkFBYSxFQUFFQSxJQUFGLEVBQVFDLHFCQUFxQkMsUUFBUUMsR0FBUixFQUE3QixFQUFiLENBQU47QUFDRCxDQUZvQyxDQUE5QiIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleGVjdXRlQW5kSGFuZGxlRXJyb3J9IGZyb20gJy4uL3NlcnZpY2VzL2Vycm9yLWhhbmRsZXInO1xyXG5pbXBvcnQge2FkZEV4dGVuc2lvbn0gZnJvbSBcIi4vZXh0ZW5zaW9uL2FkZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbW1hbmQgPSAnaW5pdCA8bmFtZT4nO1xyXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnQ3JlYXRlIGEgc2NhZmZvbGQgb2YgYWxsIGZpbGVzIGFuZCBmb2xkZXJzIHJlcXVpcmVkIHRvIGJ1aWxkIGFuIGV4dGVuc2lvbi4nO1xyXG5leHBvcnQgY29uc3QgYnVpbGRlciA9IHlhcmdzID0+IHtcclxuICByZXR1cm4geWFyZ3MudXNhZ2UoYHNob3V0ZW0gJHtjb21tYW5kfVxcblxcbiR7ZGVzY3JpcHRpb259YCkuc3RyaWN0KCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9ICh7IG5hbWUgfSkgPT4gZXhlY3V0ZUFuZEhhbmRsZUVycm9yKGFzeW5jICgpID0+IHtcclxuICBhd2FpdCBhZGRFeHRlbnNpb24oeyBuYW1lLCBleHRlcm5hbERlc3RpbmF0aW9uOiBwcm9jZXNzLmN3ZCgpIH0pO1xyXG59KTtcclxuIl19