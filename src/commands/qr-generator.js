import bluebird from 'bluebird';
import { hostname } from 'os';
import qrcode from 'qrcode-terminal';
const lookup = bluebird.promisify(require('dns').lookup);

export async function printMobilizerQR(appId, platform, ip = null) {
  ip = ip || await lookup(hostname());

  const mobilizerString = JSON.stringify({
    host: ip,
    appId,
    bundleRoot: platform === 'ios' ? 'main' : 'index.android'
  });

  console.log(mobilizerString);
  qrcode.generate(mobilizerString);
}
