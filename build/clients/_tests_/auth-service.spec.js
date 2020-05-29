'use strict';

var _chai = require('chai');

var _authService = require('../auth-service');

var authService = _interopRequireWildcard(_authService);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('Auth service client integration tests', () => {

  describe('Create a refresh token', () => {

    it('should create a refresh token', async () => {
      const token = await authService.createRefreshToken('cli-test@shoutem.com', 'password');
      console.log(token);
      _chai.assert.isOk(token, 'a token was returned');
      _chai.assert.isAtLeast(token.length, 10, 'a token is too short');
    });

    it('should report invalid credentials', async () => {
      try {
        await authService.createRefreshToken('cli-test@shoutem.com', 'invalid-password');
      } catch (err) {
        _chai.assert.strictEqual(err.statusCode, 401, 'api should respond with 401');
        return;
      }
      throw new Error('401 error should have been reported by the shoutem api when invalid password is used');
    });

    it('should create an app token', async () => {
      const refreshToken = await authService.getRefreshToken({ email: 'cli-test@shoutem.com', password: 'password' });
      const appToken = await authService.createAppAccessToken(3777, refreshToken);
      console.log(appToken);
      _chai.assert.isOk(appToken, 'a token was returned');
      _chai.assert.isAtLeast(appToken.length, 10, 'a token is too short');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRzL190ZXN0c18vYXV0aC1zZXJ2aWNlLnNwZWMuanMiXSwibmFtZXMiOlsiYXV0aFNlcnZpY2UiLCJkZXNjcmliZSIsIml0IiwidG9rZW4iLCJjcmVhdGVSZWZyZXNoVG9rZW4iLCJjb25zb2xlIiwibG9nIiwiYXNzZXJ0IiwiaXNPayIsImlzQXRMZWFzdCIsImxlbmd0aCIsImVyciIsInN0cmljdEVxdWFsIiwic3RhdHVzQ29kZSIsIkVycm9yIiwicmVmcmVzaFRva2VuIiwiZ2V0UmVmcmVzaFRva2VuIiwiZW1haWwiLCJwYXNzd29yZCIsImFwcFRva2VuIiwiY3JlYXRlQXBwQWNjZXNzVG9rZW4iXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0lBQVlBLFc7Ozs7QUFFWkMsU0FBUyx1Q0FBVCxFQUFrRCxNQUFNOztBQUV0REEsV0FBUyx3QkFBVCxFQUFtQyxNQUFNOztBQUV2Q0MsT0FBRywrQkFBSCxFQUFvQyxZQUFZO0FBQzlDLFlBQU1DLFFBQVEsTUFBTUgsWUFBWUksa0JBQVosQ0FBK0Isc0JBQS9CLEVBQXVELFVBQXZELENBQXBCO0FBQ0FDLGNBQVFDLEdBQVIsQ0FBWUgsS0FBWjtBQUNBSSxtQkFBT0MsSUFBUCxDQUFZTCxLQUFaLEVBQW1CLHNCQUFuQjtBQUNBSSxtQkFBT0UsU0FBUCxDQUFpQk4sTUFBTU8sTUFBdkIsRUFBK0IsRUFBL0IsRUFBbUMsc0JBQW5DO0FBQ0QsS0FMRDs7QUFPQVIsT0FBRyxtQ0FBSCxFQUF3QyxZQUFZO0FBQ2xELFVBQUk7QUFDRixjQUFNRixZQUFZSSxrQkFBWixDQUErQixzQkFBL0IsRUFBdUQsa0JBQXZELENBQU47QUFDRCxPQUZELENBRUUsT0FBT08sR0FBUCxFQUFZO0FBQ1pKLHFCQUFPSyxXQUFQLENBQW1CRCxJQUFJRSxVQUF2QixFQUFtQyxHQUFuQyxFQUF3Qyw2QkFBeEM7QUFDQTtBQUNEO0FBQ0QsWUFBTSxJQUFJQyxLQUFKLENBQVUsc0ZBQVYsQ0FBTjtBQUNELEtBUkQ7O0FBVUFaLE9BQUcsNEJBQUgsRUFBaUMsWUFBWTtBQUMzQyxZQUFNYSxlQUFlLE1BQU1mLFlBQVlnQixlQUFaLENBQTRCLEVBQUVDLE9BQU8sc0JBQVQsRUFBaUNDLFVBQVUsVUFBM0MsRUFBNUIsQ0FBM0I7QUFDQSxZQUFNQyxXQUFXLE1BQU1uQixZQUFZb0Isb0JBQVosQ0FBaUMsSUFBakMsRUFBdUNMLFlBQXZDLENBQXZCO0FBQ0FWLGNBQVFDLEdBQVIsQ0FBWWEsUUFBWjtBQUNBWixtQkFBT0MsSUFBUCxDQUFZVyxRQUFaLEVBQXNCLHNCQUF0QjtBQUNBWixtQkFBT0UsU0FBUCxDQUFpQlUsU0FBU1QsTUFBMUIsRUFBa0MsRUFBbEMsRUFBc0Msc0JBQXRDO0FBQ0QsS0FORDtBQVFELEdBM0JEO0FBNEJELENBOUJEIiwiZmlsZSI6ImF1dGgtc2VydmljZS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XHJcbmltcG9ydCAqIGFzIGF1dGhTZXJ2aWNlIGZyb20gJy4uL2F1dGgtc2VydmljZSc7XHJcblxyXG5kZXNjcmliZSgnQXV0aCBzZXJ2aWNlIGNsaWVudCBpbnRlZ3JhdGlvbiB0ZXN0cycsICgpID0+IHtcclxuXHJcbiAgZGVzY3JpYmUoJ0NyZWF0ZSBhIHJlZnJlc2ggdG9rZW4nLCAoKSA9PiB7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSByZWZyZXNoIHRva2VuJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IGF1dGhTZXJ2aWNlLmNyZWF0ZVJlZnJlc2hUb2tlbignY2xpLXRlc3RAc2hvdXRlbS5jb20nLCAncGFzc3dvcmQnKTtcclxuICAgICAgY29uc29sZS5sb2codG9rZW4pO1xyXG4gICAgICBhc3NlcnQuaXNPayh0b2tlbiwgJ2EgdG9rZW4gd2FzIHJldHVybmVkJyk7XHJcbiAgICAgIGFzc2VydC5pc0F0TGVhc3QodG9rZW4ubGVuZ3RoLCAxMCwgJ2EgdG9rZW4gaXMgdG9vIHNob3J0Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIHJlcG9ydCBpbnZhbGlkIGNyZWRlbnRpYWxzJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGF1dGhTZXJ2aWNlLmNyZWF0ZVJlZnJlc2hUb2tlbignY2xpLXRlc3RAc2hvdXRlbS5jb20nLCAnaW52YWxpZC1wYXNzd29yZCcpO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZXJyLnN0YXR1c0NvZGUsIDQwMSwgJ2FwaSBzaG91bGQgcmVzcG9uZCB3aXRoIDQwMScpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJzQwMSBlcnJvciBzaG91bGQgaGF2ZSBiZWVuIHJlcG9ydGVkIGJ5IHRoZSBzaG91dGVtIGFwaSB3aGVuIGludmFsaWQgcGFzc3dvcmQgaXMgdXNlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgYW4gYXBwIHRva2VuJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSBhd2FpdCBhdXRoU2VydmljZS5nZXRSZWZyZXNoVG9rZW4oeyBlbWFpbDogJ2NsaS10ZXN0QHNob3V0ZW0uY29tJywgcGFzc3dvcmQ6ICdwYXNzd29yZCcgfSk7XHJcbiAgICAgIGNvbnN0IGFwcFRva2VuID0gYXdhaXQgYXV0aFNlcnZpY2UuY3JlYXRlQXBwQWNjZXNzVG9rZW4oMzc3NywgcmVmcmVzaFRva2VuKTtcclxuICAgICAgY29uc29sZS5sb2coYXBwVG9rZW4pO1xyXG4gICAgICBhc3NlcnQuaXNPayhhcHBUb2tlbiwgJ2EgdG9rZW4gd2FzIHJldHVybmVkJyk7XHJcbiAgICAgIGFzc2VydC5pc0F0TGVhc3QoYXBwVG9rZW4ubGVuZ3RoLCAxMCwgJ2EgdG9rZW4gaXMgdG9vIHNob3J0Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgfSlcclxufSk7Il19