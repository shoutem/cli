import authService from '../auth-service';
import { getDeveloper } from '../extension-manager';

describe('Extension manager client integration tests', () => {
  describe('Fetch developer info', () => {
    it('should fetch developer info', async () => {
      const refreshToken = await authService.getRefreshToken({ email: 'cli-test@shoutem.com', password: 'password' });
      authService.authorizeRequests(refreshToken);
      const dev = await getDeveloper();
      console.log(dev);
    });
  });
});
