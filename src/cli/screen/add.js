import { createScreen } from '../../commands/screen';
import msg from '../../user_messages';

export const description = 'Add a screen for applications running this extension';
export const command = 'add <name>';
export function handler(args) {
  createScreen(args.name, (err, path) => {
    if (err) console.log(err.message);
    else console.log(msg.screen.add.complete(args.name, path));
  });
}
