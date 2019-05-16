import Promise from 'bluebird';
import ngrok from 'ngrok';

const ngrokConnect = Promise.promisify(ngrok.connect);
const ngrokKill = Promise.promisify(ngrok.kill);

function start(localPort) {
  return ngrokConnect({ proto: 'http', addr: localPort });
}

function stop() {
  return ngrokKill();
}

export default {
  start,
  stop,
};
