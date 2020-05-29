'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (url) {
  return await (0, _requestPromise2.default)(`http://sh.outem.tk/generate/${url}`);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL3VybC1zaG9ydGVuZXIuanMiXSwibmFtZXMiOlsidXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O2tCQUVlLGdCQUFlQSxHQUFmLEVBQW9CO0FBQ2pDLFNBQU8sTUFBTSw4QkFBUywrQkFBOEJBLEdBQUksRUFBM0MsQ0FBYjtBQUNELEMiLCJmaWxlIjoidXJsLXNob3J0ZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbih1cmwpIHtcclxuICByZXR1cm4gYXdhaXQgcmVxdWVzdChgaHR0cDovL3NoLm91dGVtLnRrL2dlbmVyYXRlLyR7dXJsfWApO1xyXG59XHJcbiJdfQ==