import url from 'url';
import ip from 'ip';

import tunnel from '../services/tunnel';
import analytics from '../services/analytics';
import commandExists from '../services/command-exists';
import { handleError } from '../services/error-handler';
import { startPackager } from '../services/react-native';
import { getPlatformRootDir, getPlatformConfig } from '../services/platform';
import { printMobilizerQR } from '../commands/qr-generator';
import { ensureUserIsLoggedIn } from './login';

export default async function (options) {
  try {
    analytics.setAppId(getPlatformConfig().appId);

    await ensureUserIsLoggedIn();

    const { packagerProcess } = await startPackager(getPlatformRootDir());

    let ipAddress = ip.address();
    let portNumber = 8081;

    if (options.local) {
      console.log('Make sure that the phone running Shoutem app is connected to the same network as this computer'.yellow);

      if (process.platform === 'win32') {
        console.log('If Shoutem app on your phone fails to load, try opening the 8081 TCP port manually from your Windows Firewall or disabling the firewall temporarily'.yellow);
      } else {
        console.log('Make sure that the 8081 TCP port is not blocked on this computer'.yellow);
      }
    } else {
      ipAddress = url.parse(await tunnel.start(portNumber)).hostname;
      portNumber = 80;
    }

    await printMobilizerQR(ipAddress, portNumber, options);

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
