import Promise from 'bluebird';
import url from 'url';
import { getHttpErrorMessage } from './get-http-error-message';

const downloadFile = Promise.promisify(require('download-file'));

export async function downloadFileFollowRedirect(uri, options) {
  let redirectLocation = null;

  try {
    await downloadFile(uri, options);
  } catch (err) {
    if (err.message.includes('301') || err.message.includes('302')) {
      redirectLocation = await getRedirectLocation(uri);
    } else {
      const errorMessage = getHttpErrorMessage(err.message);
      err.message = `Could not fetch platform\nRequested URL: ${this.url}\n${errorMessage}`;
      throw err;
    }

    if (redirectLocation) {
      await downloadFileFollowRedirect(redirectLocation, options);
    }
  }
}

function getRedirectLocation(uri) {
  return new Promise((resolve, reject) => {
    const protocol = url.parse(uri).protocol.slice(0, -1);
    require(protocol).get(uri, (response) => {
      resolve(response.headers.location);
    }).on('error', err => reject(err));
  });
}
