import Promise from 'bluebird';
import ngrok from 'ngrok';

const ngrokConnect = Promise.promisify(ngrok.connect);
const ngrokKill = Promise.promisify(ngrok.kill);

export function start(localPort) {
  return ngrokConnect({ proto: 'http',  addr: localPort });
}

export function stop() {
  return ngrokKill();
}
