'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _legacyService = require('../clients/legacy-service');

var _spinner = require('./spinner');

var _inquirer = require('inquirer');

var _logger = require('./logger');

var logger = _interopRequireWildcard(_logger);

var _cacheEnv = require('./cache-env');

var cache = _interopRequireWildcard(_cacheEnv);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = async function (apps = null) {
  apps = apps || (await (0, _spinner.spinify)((0, _legacyService.getLatestApps)(), 'Fetching applications'));
  logger.info('appSelector', apps);

  return (await (0, _inquirer.prompt)({
    type: 'list',
    name: 'appId',
    message: 'Select your app',
    choices: apps.map(app => ({
      name: `${app.name} (${app.id})`,
      value: app.id
    })),
    pageSize: 20
  })).appId;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9hcHAtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsibG9nZ2VyIiwiY2FjaGUiLCJhcHBzIiwiaW5mbyIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImNob2ljZXMiLCJtYXAiLCJhcHAiLCJpZCIsInZhbHVlIiwicGFnZVNpemUiLCJhcHBJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlBLE07O0FBQ1o7O0lBQVlDLEs7Ozs7a0JBRUcsZ0JBQWVDLE9BQU8sSUFBdEIsRUFBNEI7QUFDekNBLFNBQU9BLFNBQVEsTUFBTSxzQkFBUSxtQ0FBUixFQUF5Qix1QkFBekIsQ0FBZCxDQUFQO0FBQ0FGLFNBQU9HLElBQVAsQ0FBWSxhQUFaLEVBQTJCRCxJQUEzQjs7QUFFQSxTQUFPLENBQUMsTUFBTSxzQkFBTztBQUNuQkUsVUFBTSxNQURhO0FBRW5CQyxVQUFNLE9BRmE7QUFHbkJDLGFBQVMsaUJBSFU7QUFJbkJDLGFBQVNMLEtBQUtNLEdBQUwsQ0FBU0MsUUFBUTtBQUN4QkosWUFBTyxHQUFFSSxJQUFJSixJQUFLLEtBQUlJLElBQUlDLEVBQUcsR0FETDtBQUV4QkMsYUFBT0YsSUFBSUM7QUFGYSxLQUFSLENBQVQsQ0FKVTtBQVFuQkUsY0FBVTtBQVJTLEdBQVAsQ0FBUCxFQVNIQyxLQVRKO0FBVUQsQyIsImZpbGUiOiJhcHAtc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRMYXRlc3RBcHBzIH0gZnJvbSAnLi4vY2xpZW50cy9sZWdhY3ktc2VydmljZSc7XHJcbmltcG9ydCB7IHNwaW5pZnkgfSBmcm9tICcuL3NwaW5uZXInO1xyXG5pbXBvcnQgeyBwcm9tcHQgfSBmcm9tICdpbnF1aXJlcic7XHJcbmltcG9ydCAqIGFzIGxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XHJcbmltcG9ydCAqIGFzIGNhY2hlIGZyb20gJy4vY2FjaGUtZW52JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uKGFwcHMgPSBudWxsKSB7XHJcbiAgYXBwcyA9IGFwcHMgfHwgYXdhaXQgc3BpbmlmeShnZXRMYXRlc3RBcHBzKCksICdGZXRjaGluZyBhcHBsaWNhdGlvbnMnKTtcclxuICBsb2dnZXIuaW5mbygnYXBwU2VsZWN0b3InLCBhcHBzKTtcclxuXHJcbiAgcmV0dXJuIChhd2FpdCBwcm9tcHQoe1xyXG4gICAgdHlwZTogJ2xpc3QnLFxyXG4gICAgbmFtZTogJ2FwcElkJyxcclxuICAgIG1lc3NhZ2U6ICdTZWxlY3QgeW91ciBhcHAnLFxyXG4gICAgY2hvaWNlczogYXBwcy5tYXAoYXBwID0+ICh7XHJcbiAgICAgIG5hbWU6IGAke2FwcC5uYW1lfSAoJHthcHAuaWR9KWAsXHJcbiAgICAgIHZhbHVlOiBhcHAuaWRcclxuICAgIH0pKSxcclxuICAgIHBhZ2VTaXplOiAyMFxyXG4gIH0pKS5hcHBJZDtcclxufVxyXG4iXX0=