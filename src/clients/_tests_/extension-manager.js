import * as authService from '../auth-service';
import * as extManager from '../extension-manager';

describe('Extension manager client integration tests', () => {
  describe('Fetch developer info', () => {
    it('should fetch developer info', async () => {
      const refreshToken = await authService.getRefreshToken({
        email: 'cli-test@shoutem.com',
        password: 'password',
      });
      await authService.authorizeRequests(refreshToken);
      const dev = await extManager.getDeveloper();
      console.log(dev);
    });
  });
});
