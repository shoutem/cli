'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _streamsearch = require('streamsearch');

var _streamsearch2 = _interopRequireDefault(_streamsearch);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (stream, pattern) => new Promise((resolve, reject) => {
  const search = new _streamsearch2.default(pattern);
  let matched = false;

  search.on('info', isMatch => {
    if (isMatch) {
      resolve();
      matched = true;
    }
  });
  search.on('error', err => reject(err));
  search.on('finish', () => matched ? null : reject(new Error(`Match ${pattern} not found`)));
  stream.on('data', data => search.push(data));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zdHJlYW0tbWF0Y2hlci5qcyJdLCJuYW1lcyI6WyJzdHJlYW0iLCJwYXR0ZXJuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzZWFyY2giLCJTdHJlYW1TZWFyY2giLCJtYXRjaGVkIiwib24iLCJpc01hdGNoIiwiZXJyIiwiRXJyb3IiLCJkYXRhIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztrQkFFZSxDQUFDQSxNQUFELEVBQVNDLE9BQVQsS0FBcUIsSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUNuRSxRQUFNQyxTQUFTLElBQUlDLHNCQUFKLENBQWlCTCxPQUFqQixDQUFmO0FBQ0EsTUFBSU0sVUFBVSxLQUFkOztBQUVBRixTQUFPRyxFQUFQLENBQVUsTUFBVixFQUFrQkMsV0FBVztBQUMzQixRQUFJQSxPQUFKLEVBQWE7QUFDWE47QUFDQUksZ0JBQVUsSUFBVjtBQUNEO0FBQ0YsR0FMRDtBQU1BRixTQUFPRyxFQUFQLENBQVUsT0FBVixFQUFtQkUsT0FBT04sT0FBT00sR0FBUCxDQUExQjtBQUNBTCxTQUFPRyxFQUFQLENBQVUsUUFBVixFQUFvQixNQUFNRCxVQUFVLElBQVYsR0FBaUJILE9BQU8sSUFBSU8sS0FBSixDQUFXLFNBQVFWLE9BQVEsWUFBM0IsQ0FBUCxDQUEzQztBQUNBRCxTQUFPUSxFQUFQLENBQVUsTUFBVixFQUFrQkksUUFBUVAsT0FBT1EsSUFBUCxDQUFZRCxJQUFaLENBQTFCO0FBQ0QsQ0FibUMsQyIsImZpbGUiOiJzdHJlYW0tbWF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdHJlYW1TZWFyY2ggZnJvbSAnc3RyZWFtc2VhcmNoJztcclxuaW1wb3J0ICdjb2xvcnMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHN0cmVhbSwgcGF0dGVybikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gIGNvbnN0IHNlYXJjaCA9IG5ldyBTdHJlYW1TZWFyY2gocGF0dGVybik7XHJcbiAgbGV0IG1hdGNoZWQgPSBmYWxzZTtcclxuXHJcbiAgc2VhcmNoLm9uKCdpbmZvJywgaXNNYXRjaCA9PiB7XHJcbiAgICBpZiAoaXNNYXRjaCkge1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICAgIG1hdGNoZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHNlYXJjaC5vbignZXJyb3InLCBlcnIgPT4gcmVqZWN0KGVycikpO1xyXG4gIHNlYXJjaC5vbignZmluaXNoJywgKCkgPT4gbWF0Y2hlZCA/IG51bGwgOiByZWplY3QobmV3IEVycm9yKGBNYXRjaCAke3BhdHRlcm59IG5vdCBmb3VuZGApKSk7XHJcbiAgc3RyZWFtLm9uKCdkYXRhJywgZGF0YSA9PiBzZWFyY2gucHVzaChkYXRhKSk7XHJcbn0pO1xyXG4iXX0=