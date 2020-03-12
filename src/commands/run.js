import url from 'url';
import ip from 'ip';
import * as tunnel from '../services/tunnel';
import { startPackager } from '../services/react-native';
import { printMobilizerQR } from '../commands/qr-generator';
import * as analytics from '../services/analytics';
import { handleError } from '../services/error-handler';
import { ensureUserIsLoggedIn } from './login';
import { getPlatformRootDir, getPlatformConfig } from '../services/platform';
import commandExists from '../services/command-exists';

export default async function (options) {
  try {
    analytics.setAppId((await getPlatformConfig()).appId);
    await ensureUserIsLoggedIn();

    const { packagerProcess } = await startPackager(await getPlatformRootDir());

    if (options.local) {
      console.log('Make sure that the phone running Shoutem app is connected to the same network as this computer'.yellow);
      if (process.platform === 'win32') {
        console.log('If Shoutem app on your phone fails to load, try opening the 8081 TCP port manually from your Windows Firewall or disabling the firewall temporarily'.yellow);
      } else {
        console.log('Make sure that the 8081 TCP port is not blocked on this computer'.yellow);
      }
      await printMobilizerQR(ip.address(), 8081, options);
    } else {
      await printMobilizerQR(url.parse(await tunnel.start(8081)).hostname, 80, options);
    }

    console.log('Keep this process running if app is used in debug mode'.bold.yellow);
    await packagerProcess;
  } catch (err) {
    if (!/^win/.test(process.platform) && !await commandExists('watchman')) {
      console.log('HINT: You should probably install Facebook\'s `watchman` before running `shoutem run` command'.bold.yellow);
    }
    await tunnel.stop();
    await handleError(err);
  }
}
