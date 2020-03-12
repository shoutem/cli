import qrcode from 'qrcode-terminal';
import 'colors';

export async function printMobilizerQR(host, port, { dev, small }) {
  const mobilizerString = `http://shoutem.app.link/?host=${host}&port=${port}&dev=${!!dev}`;

  console.log(mobilizerString.bold);
  qrcode.generate(mobilizerString, { small });
}
