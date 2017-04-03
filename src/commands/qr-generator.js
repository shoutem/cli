import qrcode from 'qrcode-terminal';
import ip from 'ip';
import 'colors';

export async function printMobilizerQR(host = ip.address(), port = 8081) {
  const mobilizerString = `http://shoutem.app.link/?host=${host}&port=${port}`;

  console.log(mobilizerString.bold);
  qrcode.generate(mobilizerString);
}
