import Promise from 'bluebird';
const ngrokConnect = Promise.promisify(require('ngrok').connect);

export async function start(localPort) {
  return await ngrokConnect({ proto: 'http',  addr: localPort });
}
