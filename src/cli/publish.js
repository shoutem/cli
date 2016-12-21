/* eslint no-console: 0 */
import _ from 'lodash';
import msg from '../user_messages';
import { publishExtension } from '../commands/publish';
import { handleError } from '../extension/error-handler';


export const description = 'Publish current extension version.';
export const command = 'publish';
export function handler() {
  publishExtension((err, extJson) => {
    if (err) {
      try {
        const body = JSON.parse(err.response.body);
        const detail = body.errors[0].detail;
        console.log(msg.publish.failed(detail));
      } catch (err2) {
        handleError(err);
      }
    } else {
      console.log(msg.publish.complete(extJson));
    }
  });
}
