import qrcode from 'qrcode-terminal';
import ip from 'ip';
import 'colors';

export async function printMobilizerQR(host = ip.address()) {
  const mobilizerString = `http://shoutem.app.link/?host=${host}`;

  console.log(mobilizerString.bold);
  qrcode.generate(mobilizerString);
}
