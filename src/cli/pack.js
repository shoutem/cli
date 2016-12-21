/* eslint no-console: 0 */
import shoutemPack from '../extension/packer';

export const description = 'Pack shoutem extensions for upload';
export const command = 'pack';
export const builder = {
  nobuild: {
    type: 'boolean',
    description: 'Pack the extension without building it.'
  }
};
export function handler(args) {
  shoutemPack(process.cwd(), args)
    .then(result => {
      console.log(result.package);
    })
    .catch(console.log);
}
