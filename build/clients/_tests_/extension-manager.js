'use strict';

var _chai = require('chai');

var _authService = require('../auth-service');

var authService = _interopRequireWildcard(_authService);

var _extensionManager = require('../extension-manager');

var extManager = _interopRequireWildcard(_extensionManager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('Extension manager client integration tests', () => {

  describe('Fetch developer info', () => {

    it('should fetch developer info', async () => {
      const refreshToken = await authService.getRefreshToken({ email: 'cli-test@shoutem.com', password: 'password' });
      await authService.authorizeRequests(refreshToken);
      const dev = await extManager.getDeveloper();
      console.log(dev);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRzL190ZXN0c18vZXh0ZW5zaW9uLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiYXV0aFNlcnZpY2UiLCJleHRNYW5hZ2VyIiwiZGVzY3JpYmUiLCJpdCIsInJlZnJlc2hUb2tlbiIsImdldFJlZnJlc2hUb2tlbiIsImVtYWlsIiwicGFzc3dvcmQiLCJhdXRob3JpemVSZXF1ZXN0cyIsImRldiIsImdldERldmVsb3BlciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0lBQVlBLFc7O0FBQ1o7O0lBQVlDLFU7Ozs7QUFFWkMsU0FBUyw0Q0FBVCxFQUF1RCxNQUFNOztBQUUzREEsV0FBUyxzQkFBVCxFQUFpQyxNQUFNOztBQUVyQ0MsT0FBRyw2QkFBSCxFQUFrQyxZQUFZO0FBQzVDLFlBQU1DLGVBQWUsTUFBTUosWUFBWUssZUFBWixDQUE0QixFQUFFQyxPQUFPLHNCQUFULEVBQWlDQyxVQUFVLFVBQTNDLEVBQTVCLENBQTNCO0FBQ0EsWUFBTVAsWUFBWVEsaUJBQVosQ0FBOEJKLFlBQTlCLENBQU47QUFDQSxZQUFNSyxNQUFNLE1BQU1SLFdBQVdTLFlBQVgsRUFBbEI7QUFDQUMsY0FBUUMsR0FBUixDQUFZSCxHQUFaO0FBQ0QsS0FMRDtBQVNELEdBWEQ7QUFZRCxDQWREIiwiZmlsZSI6ImV4dGVuc2lvbi1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XHJcbmltcG9ydCAqIGFzIGF1dGhTZXJ2aWNlIGZyb20gJy4uL2F1dGgtc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIGV4dE1hbmFnZXIgZnJvbSAnLi4vZXh0ZW5zaW9uLW1hbmFnZXInO1xyXG5cclxuZGVzY3JpYmUoJ0V4dGVuc2lvbiBtYW5hZ2VyIGNsaWVudCBpbnRlZ3JhdGlvbiB0ZXN0cycsICgpID0+IHtcclxuXHJcbiAgZGVzY3JpYmUoJ0ZldGNoIGRldmVsb3BlciBpbmZvJywgKCkgPT4ge1xyXG5cclxuICAgIGl0KCdzaG91bGQgZmV0Y2ggZGV2ZWxvcGVyIGluZm8nLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IGF3YWl0IGF1dGhTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbih7IGVtYWlsOiAnY2xpLXRlc3RAc2hvdXRlbS5jb20nLCBwYXNzd29yZDogJ3Bhc3N3b3JkJyB9KTtcclxuICAgICAgYXdhaXQgYXV0aFNlcnZpY2UuYXV0aG9yaXplUmVxdWVzdHMocmVmcmVzaFRva2VuKTtcclxuICAgICAgY29uc3QgZGV2ID0gYXdhaXQgZXh0TWFuYWdlci5nZXREZXZlbG9wZXIoKTtcclxuICAgICAgY29uc29sZS5sb2coZGV2KTtcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gIH0pXHJcbn0pOyJdfQ==