import msg from '../../user_messages';
import { createShortcut } from '../../commands/shortcut';

export const description = 'Add an application shortcut';
export const command = 'add <name>';
export function handler(args) {
  createShortcut(args.name, err => {
    if (err) console.log(err.message);
    else console.log(msg.shortcut.add.complete(args.name));
  });
}
