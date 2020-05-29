'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (patterns) {
  return _lodash2.default.uniq(_lodash2.default.flatten((await Promise.all(patterns.map(p => (0, _globPromise2.default)(p))))));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9tdWx0aWdsb2IuanMiXSwibmFtZXMiOlsicGF0dGVybnMiLCJfIiwidW5pcSIsImZsYXR0ZW4iLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O2tCQUVlLGdCQUFlQSxRQUFmLEVBQXlCO0FBQ3RDLFNBQU9DLGlCQUFFQyxJQUFGLENBQU9ELGlCQUFFRSxPQUFGLEVBQVUsTUFBTUMsUUFBUUMsR0FBUixDQUFZTCxTQUFTTSxHQUFULENBQWFDLEtBQUssMkJBQUtBLENBQUwsQ0FBbEIsQ0FBWixDQUFoQixFQUFQLENBQVA7QUFDRCxDIiwiZmlsZSI6Im11bHRpZ2xvYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnbG9iIGZyb20gJ2dsb2ItcHJvbWlzZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbihwYXR0ZXJucykge1xyXG4gIHJldHVybiBfLnVuaXEoXy5mbGF0dGVuKGF3YWl0IFByb21pc2UuYWxsKHBhdHRlcm5zLm1hcChwID0+IGdsb2IocCkpKSkpO1xyXG59XHJcbiJdfQ==