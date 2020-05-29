'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonApiError = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
exports.get = get;
exports.put = put;
exports.patch = patch;
exports.del = del;
exports.post = post;

var _jsonapiSerializer = require('jsonapi-serializer');

var _logger = require('../services/logger');

var logger = _interopRequireWildcard(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const deserializer = new _jsonapiSerializer.Deserializer({
  keyForAttribute: 'camelCase'
});

class JsonApiError {
  constructor(message, request, body, response, statusCode) {
    this.message = message;
    this.request = request;
    this.body = body;
    this.response = response;
    this.statusCode = statusCode;
  }
}

exports.JsonApiError = JsonApiError;
async function execute(method, url, opts = {}) {
  url = url.toString();

  const jsonApiHeaders = {
    Accept: 'application/vnd.api+json'
  };
  if (opts.body) {
    jsonApiHeaders['Content-Type'] = 'application/vnd.api+json';
  }

  const req = new Request(url, _extends({}, opts, {
    method: method,
    headers: _extends({}, jsonApiHeaders, opts.headers)
  }));

  logger.info(`${method} ${url}`, req);
  const response = await fetch(req);
  const textResponse = await response.text();

  if (!textResponse) {
    return null;
  }

  const json = JSON.parse(textResponse);

  if (response.ok) {
    try {
      return await deserializer.deserialize(json);
    } catch (err) {
      // if non json-api object is returned, use the object as-is
      return json;
    }
  }

  delete response._raw;
  throw new JsonApiError(null, req, json, response, response.status);
}

function get(uri) {
  return execute('get', uri);
}

function put(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('put', url, _extends({}, opts, {
      body: JSON.stringify(jsonBody)
    }));
  }

  return execute('put', url, opts);
}

function patch(url, jsonBody = null, opts) {
  if (jsonBody) {
    return execute('patch', url, _extends({}, opts, {
      body: JSON.stringify(jsonBody)
    }));
  }

  return execute('patch', url, opts);
}

function del(uri) {
  return execute('delete', uri);
}

function post(url, jsonBody = null, opts = {}) {
  if (jsonBody) {
    return execute('post', url, _extends({}, opts, {
      body: JSON.stringify(jsonBody)
    }));
  }

  return execute('post', url, opts);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL2pzb24tYXBpLWNsaWVudC5qcyJdLCJuYW1lcyI6WyJleGVjdXRlIiwiZ2V0IiwicHV0IiwicGF0Y2giLCJkZWwiLCJwb3N0IiwibG9nZ2VyIiwiZGVzZXJpYWxpemVyIiwiRGVzZXJpYWxpemVyIiwia2V5Rm9yQXR0cmlidXRlIiwiSnNvbkFwaUVycm9yIiwiY29uc3RydWN0b3IiLCJtZXNzYWdlIiwicmVxdWVzdCIsImJvZHkiLCJyZXNwb25zZSIsInN0YXR1c0NvZGUiLCJtZXRob2QiLCJ1cmwiLCJvcHRzIiwidG9TdHJpbmciLCJqc29uQXBpSGVhZGVycyIsIkFjY2VwdCIsInJlcSIsIlJlcXVlc3QiLCJoZWFkZXJzIiwiaW5mbyIsImZldGNoIiwidGV4dFJlc3BvbnNlIiwidGV4dCIsImpzb24iLCJKU09OIiwicGFyc2UiLCJvayIsImRlc2VyaWFsaXplIiwiZXJyIiwiX3JhdyIsInN0YXR1cyIsInVyaSIsImpzb25Cb2R5Iiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFpQnNCQSxPLEdBQUFBLE87UUEwQ05DLEcsR0FBQUEsRztRQUlBQyxHLEdBQUFBLEc7UUFXQUMsSyxHQUFBQSxLO1FBV0FDLEcsR0FBQUEsRztRQUlBQyxJLEdBQUFBLEk7O0FBekZoQjs7QUFDQTs7SUFBWUMsTTs7OztBQUVaLE1BQU1DLGVBQWUsSUFBSUMsK0JBQUosQ0FBaUI7QUFDcENDLG1CQUFpQjtBQURtQixDQUFqQixDQUFyQjs7QUFJTyxNQUFNQyxZQUFOLENBQW1CO0FBQ3hCQyxjQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsSUFBOUIsRUFBb0NDLFFBQXBDLEVBQThDQyxVQUE5QyxFQUEwRDtBQUN4RCxTQUFLSixPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtD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LWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlc2VyaWFsaXplciB9IGZyb20gJ2pzb25hcGktc2VyaWFsaXplcic7XHJcbmltcG9ydCAqIGFzIGxvZ2dlciBmcm9tICcuLi9zZXJ2aWNlcy9sb2dnZXInO1xyXG5cclxuY29uc3QgZGVzZXJpYWxpemVyID0gbmV3IERlc2VyaWFsaXplcih7XHJcbiAga2V5Rm9yQXR0cmlidXRlOiAnY2FtZWxDYXNlJ1xyXG59KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uQXBpRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHJlcXVlc3QsIGJvZHksIHJlc3BvbnNlLCBzdGF0dXNDb2RlKSB7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICAgIHRoaXMuYm9keSA9IGJvZHk7XHJcbiAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGUobWV0aG9kLCB1cmwsIG9wdHMgPSB7fSkge1xyXG4gIHVybCA9IHVybC50b1N0cmluZygpO1xyXG5cclxuICBjb25zdCBqc29uQXBpSGVhZGVycyA9IHtcclxuICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicsXHJcbiAgfTtcclxuICBpZiAob3B0cy5ib2R5KSB7XHJcbiAgICBqc29uQXBpSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJztcclxuICB9XHJcblxyXG4gIGNvbnN0IHJlcSA9IG5ldyBSZXF1ZXN0KHVybCwge1xyXG4gICAgLi4ub3B0cyxcclxuICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAuLi5qc29uQXBpSGVhZGVycyxcclxuICAgICAgLi4ub3B0cy5oZWFkZXJzXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGxvZ2dlci5pbmZvKGAke21ldGhvZH0gJHt1cmx9YCwgcmVxKTtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcSk7XHJcbiAgY29uc3QgdGV4dFJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cclxuICBpZiAoIXRleHRSZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh0ZXh0UmVzcG9uc2UpO1xyXG5cclxuICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBkZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoanNvbik7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgLy8gaWYgbm9uIGpzb24tYXBpIG9iamVjdCBpcyByZXR1cm5lZCwgdXNlIHRoZSBvYmplY3QgYXMtaXNcclxuICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGUgcmVzcG9uc2UuX3JhdztcclxuICB0aHJvdyBuZXcgSnNvbkFwaUVycm9yKG51bGwsIHJlcSwganNvbiwgcmVzcG9uc2UsIHJlc3BvbnNlLnN0YXR1cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQodXJpKSB7XHJcbiAgcmV0dXJuIGV4ZWN1dGUoJ2dldCcsIHVyaSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwdXQodXJsLCBqc29uQm9keSA9IG51bGwsIG9wdHMpIHtcclxuICBpZiAoanNvbkJvZHkpIHtcclxuICAgIHJldHVybiBleGVjdXRlKCdwdXQnLCB1cmwsIHtcclxuICAgICAgLi4ub3B0cyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoanNvbkJvZHkpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBleGVjdXRlKCdwdXQnLCB1cmwsIG9wdHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2godXJsLCBqc29uQm9keSA9IG51bGwsIG9wdHMpIHtcclxuICBpZiAoanNvbkJvZHkpIHtcclxuICAgIHJldHVybiBleGVjdXRlKCdwYXRjaCcsIHVybCwge1xyXG4gICAgICAuLi5vcHRzLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqc29uQm9keSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGV4ZWN1dGUoJ3BhdGNoJywgdXJsLCBvcHRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbCh1cmkpIHtcclxuICByZXR1cm4gZXhlY3V0ZSgnZGVsZXRlJywgdXJpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvc3QodXJsLCBqc29uQm9keSA9IG51bGwsIG9wdHMgPSB7fSkge1xyXG4gIGlmIChqc29uQm9keSkge1xyXG4gICAgcmV0dXJuIGV4ZWN1dGUoJ3Bvc3QnLCB1cmwsIHtcclxuICAgICAgLi4ub3B0cyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoanNvbkJvZHkpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBleGVjdXRlKCdwb3N0JywgdXJsLCBvcHRzKTtcclxufVxyXG4iXX0=