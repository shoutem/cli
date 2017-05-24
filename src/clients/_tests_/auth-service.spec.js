import { assert } from 'chai';
import * as authService from '../auth-service';

describe('Auth service client integration tests', () => {

  describe('Create a refresh token', () => {

    it('should create a refresh token', async () => {
      const token = await authService.createRefreshToken('cli-test@shoutem.com', 'password');
      console.log(token);
      assert.isOk(token, 'a token was returned');
      assert.isAtLeast(token.length, 10, 'a token is too short');
    });

    it('should report invalid credentials', async () => {
      try {
        await authService.createRefreshToken('cli-test@shoutem.com', 'invalid-password');
      } catch (err) {
        assert.strictEqual(err.statusCode, 401, 'api should respond with 401');
        return;
      }
      throw new Error('401 error should have been reported by the shoutem api when invalid password is used');
    });



  })
});