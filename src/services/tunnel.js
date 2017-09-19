import Promise from 'bluebird';
import ngrok from 'ngrok';

const ngrokConnect = Promise.promisify(ngrok.connect);
const ngrokKill = Promise.promisify(ngrok.kill);

export async function start(localPort) {
  return await ngrokConnect({ proto: 'http',  addr: localPort });
}

export async function stop() {
  return await ngrokKill();
}
