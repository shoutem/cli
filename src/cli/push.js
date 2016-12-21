/* eslint no-console: 0 */
import _ from 'lodash';
import { uploadExtension } from '../commands/push';
import msg from '../user_messages';
import { handleError } from '../extension/error-handler';


export const description = 'Upload local extension code and assets.';
export const command = 'push';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Push the extension without building it. Use this option carefully!'
  }
};

export async function handler(args) {
  try {
    const result = await uploadExtension(args);
    const packResult = result.packResult;
    const notPacked = _.difference(packResult.allDirs, packResult.packedDirs);
    if (notPacked.length > 0) {
      console.error(msg.push.missingPackageJson(notPacked));
    } else {
      console.log(msg.push.complete())
    }
  } catch (err) {
    handleError(err);
  }
}
