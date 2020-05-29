'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestApps = getLatestApps;
exports.getApp = getApp;
exports.getPublishingProperties = getPublishingProperties;

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _services = require('../../config/services');

var _jsonApiClient = require('./json-api-client');

var jsonApi = _interopRequireWildcard(_jsonApiClient);

var _logger = require('../services/logger');

var logger = _interopRequireWildcard(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const legacyServiceUri = new _urijs2.default(_services.legacyService);

async function getLatestApps() {
  const body = await jsonApi.get(legacyServiceUri.clone().segment('/v1/apps').search({ sort: '-modificationTime' }));

  logger.info('getLatestApps', body);
  return body;
}

async function getApp(appId) {
  const url = legacyServiceUri.clone().segment(`/v1/apps/${appId}`);
  return await jsonApi.get(url);
}

async function getPublishingProperties(appId) {
  const url = legacyServiceUri.clone().segment(`/api/applications/publishing_properties.json`).search({ nid: appId });
  return await jsonApi.get(url);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL2xlZ2FjeS1zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImdldExhdGVzdEFwcHMiLCJnZXRBcHAiLCJnZXRQdWJsaXNoaW5nUHJvcGVydGllcyIsImpzb25BcGkiLCJsb2dnZXIiLCJsZWdhY3lTZXJ2aWNlVXJpIiwiVVJJIiwibGVnYWN5U2VydmljZSIsImJvZHkiLCJnZXQiLCJjbG9uZSIsInNlZ21lbnQiLCJzZWFyY2giLCJzb3J0IiwiaW5mbyIsImFwcElkIiwidXJsIiwibmlkIl0sIm1hcHBpbmdzIjoiOzs7OztRQU9zQkEsYSxHQUFBQSxhO1FBVUFDLE0sR0FBQUEsTTtRQUtBQyx1QixHQUFBQSx1Qjs7QUF0QnRCOzs7O0FBQ0E7O0FBQ0E7O0lBQVlDLE87O0FBQ1o7O0lBQVlDLE07Ozs7OztBQUVaLE1BQU1DLG1CQUFtQixJQUFJQyxlQUFKLENBQVFDLHVCQUFSLENBQXpCOztBQUVPLGVBQWVQLGFBQWYsR0FBK0I7QUFDcEMsUUFBTVEsT0FBTyxNQUFNTCxRQUFRTSxHQUFSLENBQVlKLGlCQUFpQkssS0FBakIsR0FDNUJDLE9BRDRCLENBQ3BCLFVBRG9CLEVBRTVCQyxNQUY0QixDQUVyQixFQUFFQyxNQUFNLG1CQUFSLEVBRnFCLENBQVosQ0FBbkI7O0FBS0FULFNBQU9VLElBQVAsQ0FBWSxlQUFaLEVBQTZCTixJQUE3QjtBQUNBLFNBQU9BLElBQVA7QUFDRDs7QUFFTSxlQUFlUCxNQUFmLENBQXNCYyxLQUF0QixFQUE2QjtBQUNsQyxRQUFNQyxNQUFNWCxpQkFBaUJLLEtBQWpCLEdBQXlCQyxPQUF6QixDQUFrQyxZQUFXSSxLQUFNLEVBQW5ELENBQVo7QUFDQSxTQUFPLE1BQU1aLFFBQVFNLEdBQVIsQ0FBWU8sR0FBWixDQUFiO0FBQ0Q7O0FBRU0sZUFBZWQsdUJBQWYsQ0FBdUNhLEtBQXZDLEVBQThDO0FBQ25ELFFBQU1DLE1BQU1YLGlCQUFpQkssS0FBakIsR0FBeUJDLE9BQXpCLENBQWtDLDhDQUFsQyxFQUFpRkMsTUFBakYsQ0FBd0YsRUFBQ0ssS0FBS0YsS0FBTixFQUF4RixDQUFaO0FBQ0EsU0FBTyxNQUFNWixRQUFRTSxHQUFSLENBQVlPLEdBQVosQ0FBYjtBQUNEIiwiZmlsZSI6ImxlZ2FjeS1zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVSSSBmcm9tICd1cmlqcyc7XHJcbmltcG9ydCB7IGxlZ2FjeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb25maWcvc2VydmljZXMnO1xyXG5pbXBvcnQgKiBhcyBqc29uQXBpIGZyb20gJy4vanNvbi1hcGktY2xpZW50JztcclxuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4uL3NlcnZpY2VzL2xvZ2dlcic7XHJcblxyXG5jb25zdCBsZWdhY3lTZXJ2aWNlVXJpID0gbmV3IFVSSShsZWdhY3lTZXJ2aWNlKTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMYXRlc3RBcHBzKCkge1xyXG4gIGNvbnN0IGJvZHkgPSBhd2FpdCBqc29uQXBpLmdldChsZWdhY3lTZXJ2aWNlVXJpLmNsb25lKClcclxuICAgIC5zZWdtZW50KCcvdjEvYXBwcycpXHJcbiAgICAuc2VhcmNoKHsgc29ydDogJy1tb2RpZmljYXRpb25UaW1lJyB9KVxyXG4gICk7XHJcblxyXG4gIGxvZ2dlci5pbmZvKCdnZXRMYXRlc3RBcHBzJywgYm9keSk7XHJcbiAgcmV0dXJuIGJvZHk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBcHAoYXBwSWQpIHtcclxuICBjb25zdCB1cmwgPSBsZWdhY3lTZXJ2aWNlVXJpLmNsb25lKCkuc2VnbWVudChgL3YxL2FwcHMvJHthcHBJZH1gKTtcclxuICByZXR1cm4gYXdhaXQganNvbkFwaS5nZXQodXJsKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1Ymxpc2hpbmdQcm9wZXJ0aWVzKGFwcElkKSB7XHJcbiAgY29uc3QgdXJsID0gbGVnYWN5U2VydmljZVVyaS5jbG9uZSgpLnNlZ21lbnQoYC9hcGkvYXBwbGljYXRpb25zL3B1Ymxpc2hpbmdfcHJvcGVydGllcy5qc29uYCkuc2VhcmNoKHtuaWQ6IGFwcElkfSk7XHJcbiAgcmV0dXJuIGF3YWl0IGpzb25BcGkuZ2V0KHVybCk7XHJcbn1cclxuIl19