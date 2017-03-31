import qrcode from 'qrcode-terminal';
import ip from 'ip';

export async function printMobilizerQR(platform, host) {
  host = host || ip.address();

  const mobilizerString = JSON.stringify({
    host,
    bundleRoot: platform === 'ios' ? 'index.ios' : 'index.android'
  });

  console.log(mobilizerString);
  qrcode.generate(mobilizerString);
}
