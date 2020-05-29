'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValue = getValue;
exports.setValue = setValue;

var _cache = require('./cache');

var cache = _interopRequireWildcard(_cache);

var _serverEnv = require('../clients/server-env');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

async function getValue(key) {
  return await cache.getValue(`${(0, _serverEnv.getHostEnvName)()}.${key}`);
}

async function setValue(key, value, expirationSeconds) {
  return await cache.setValue(`${(0, _serverEnv.getHostEnvName)()}.${key}`, value, expirationSeconds);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9jYWNoZS1lbnYuanMiXSwibmFtZXMiOlsiZ2V0VmFsdWUiLCJzZXRWYWx1ZSIsImNhY2hlIiwia2V5IiwidmFsdWUiLCJleHBpcmF0aW9uU2Vjb25kcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHc0JBLFEsR0FBQUEsUTtRQUlBQyxRLEdBQUFBLFE7O0FBUHRCOztJQUFZQyxLOztBQUNaOzs7O0FBRU8sZUFBZUYsUUFBZixDQUF3QkcsR0FBeEIsRUFBNkI7QUFDbEMsU0FBTyxNQUFNRCxNQUFNRixRQUFOLENBQWdCLEdBQUUsZ0NBQWlCLElBQUdHLEdBQUksRUFBMUMsQ0FBYjtBQUNEOztBQUVNLGVBQWVGLFFBQWYsQ0FBd0JFLEdBQXhCLEVBQTZCQyxLQUE3QixFQUFvQ0MsaUJBQXBDLEVBQXVEO0FBQzVELFNBQU8sTUFBTUgsTUFBTUQsUUFBTixDQUFnQixHQUFFLGdDQUFpQixJQUFHRSxHQUFJLEVBQTFDLEVBQTZDQyxLQUE3QyxFQUFvREMsaUJBQXBELENBQWI7QUFDRCIsImZpbGUiOiJjYWNoZS1lbnYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjYWNoZSBmcm9tICcuL2NhY2hlJztcclxuaW1wb3J0IHsgZ2V0SG9zdEVudk5hbWUgfSBmcm9tICcuLi9jbGllbnRzL3NlcnZlci1lbnYnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhbHVlKGtleSkge1xyXG4gIHJldHVybiBhd2FpdCBjYWNoZS5nZXRWYWx1ZShgJHtnZXRIb3N0RW52TmFtZSgpfS4ke2tleX1gKVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0VmFsdWUoa2V5LCB2YWx1ZSwgZXhwaXJhdGlvblNlY29uZHMpIHtcclxuICByZXR1cm4gYXdhaXQgY2FjaGUuc2V0VmFsdWUoYCR7Z2V0SG9zdEVudk5hbWUoKX0uJHtrZXl9YCwgdmFsdWUsIGV4cGlyYXRpb25TZWNvbmRzKTtcclxufVxyXG4iXX0=