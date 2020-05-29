'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require('inquirer');

var _logger = require('./logger');

var logger = _interopRequireWildcard(_logger);

var _spinner = require('./spinner');

var _platform = require('../commands/platform');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (platforms = null) {
  platforms = platforms || (await (0, _spinner.spinify)((0, _platform.getAvailablePlatforms)(), 'Fetching platforms'));
  logger.info('platformSelector', platforms);

  return (await (0, _inquirer.prompt)({
    type: 'list',
    name: 'platformId',
    message: 'Select your platform',
    choices: platforms.map(platform => ({
      name: `${_lodash2.default.get(platform, ['author', 'name'])}@${platform.version} (${platform.id})`,
      value: platform.id
    })),
    pageSize: 20
  })).platformId;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wbGF0Zm9ybS1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJsb2dnZXIiLCJwbGF0Zm9ybXMiLCJpbmZvIiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiY2hvaWNlcyIsIm1hcCIsInBsYXRmb3JtIiwiXyIsImdldCIsInZlcnNpb24iLCJpZCIsInZhbHVlIiwicGFnZVNpemUiLCJwbGF0Zm9ybUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztJQUFZQSxNOztBQUNaOztBQUNBOzs7Ozs7a0JBRWUsZ0JBQWdCQyxZQUFZLElBQTVCLEVBQWtDO0FBQy9DQSxjQUFZQSxjQUFhLE1BQU0sc0JBQVEsc0NBQVIsRUFBaUMsb0JBQWpDLENBQW5CLENBQVo7QUFDQUQsU0FBT0UsSUFBUCxDQUFZLGtCQUFaLEVBQWdDRCxTQUFoQzs7QUFFQSxTQUFPLENBQUMsTUFBTSxzQkFBTztBQUNuQkUsVUFBTSxNQURhO0FBRW5CQyxVQUFNLFlBRmE7QUFHbkJDLGFBQVMsc0JBSFU7QUFJbkJDLGFBQVNMLFVBQVVNLEdBQVYsQ0FBY0MsYUFBYTtBQUNsQ0osWUFBTyxHQUFFSyxpQkFBRUMsR0FBRixDQUFNRixRQUFOLEVBQWdCLENBQUMsUUFBRCxFQUFXLE1BQVgsQ0FBaEIsQ0FBb0MsSUFBR0EsU0FBU0csT0FBUSxLQUFJSCxTQUFTSSxFQUFHLEdBRC9DO0FBRWxDQyxhQUFPTCxTQUFTSTtBQUZrQixLQUFiLENBQWQsQ0FKVTtBQVFuQkUsY0FBVTtBQVJTLEdBQVAsQ0FBUCxFQVNIQyxVQVRKO0FBVUQsQyIsImZpbGUiOiJwbGF0Zm9ybS1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IHByb21wdCB9IGZyb20gJ2lucXVpcmVyJztcclxuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcclxuaW1wb3J0IHsgc3BpbmlmeSB9IGZyb20gJy4vc3Bpbm5lcic7XHJcbmltcG9ydCB7IGdldEF2YWlsYWJsZVBsYXRmb3JtcyB9IGZyb20gJy4uL2NvbW1hbmRzL3BsYXRmb3JtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChwbGF0Zm9ybXMgPSBudWxsKSB7XHJcbiAgcGxhdGZvcm1zID0gcGxhdGZvcm1zIHx8IGF3YWl0IHNwaW5pZnkoZ2V0QXZhaWxhYmxlUGxhdGZvcm1zKCksICdGZXRjaGluZyBwbGF0Zm9ybXMnKTtcclxuICBsb2dnZXIuaW5mbygncGxhdGZvcm1TZWxlY3RvcicsIHBsYXRmb3Jtcyk7XHJcblxyXG4gIHJldHVybiAoYXdhaXQgcHJvbXB0KHtcclxuICAgIHR5cGU6ICdsaXN0JyxcclxuICAgIG5hbWU6ICdwbGF0Zm9ybUlkJyxcclxuICAgIG1lc3NhZ2U6ICdTZWxlY3QgeW91ciBwbGF0Zm9ybScsXHJcbiAgICBjaG9pY2VzOiBwbGF0Zm9ybXMubWFwKHBsYXRmb3JtID0+ICh7XHJcbiAgICAgIG5hbWU6IGAke18uZ2V0KHBsYXRmb3JtLCBbJ2F1dGhvcicsICduYW1lJ10pfUAke3BsYXRmb3JtLnZlcnNpb259ICgke3BsYXRmb3JtLmlkfSlgLFxyXG4gICAgICB2YWx1ZTogcGxhdGZvcm0uaWQsXHJcbiAgICB9KSksXHJcbiAgICBwYWdlU2l6ZTogMjAsXHJcbiAgfSkpLnBsYXRmb3JtSWQ7XHJcbn1cclxuIl19