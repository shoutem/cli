import bluebird from 'bluebird';
const ngrokConnect = bluebird.promisify(require('ngrok').connect);

export async function start(localPort) {
  return await ngrokConnect({ proto: 'http',  addr: localPort });
}