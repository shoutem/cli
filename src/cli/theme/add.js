import msg from '../../user_messages';
import { createTheme } from '../../commands/theme';

export const description = 'Add a theme to the current extension';
export const command = 'add <name>';
export function handler(args) {
  createTheme(args.name, (err, paths) => {
    if (err) console.log(err.message);
    else {
      for (const path of paths) console.log(msg.theme.add.complete(args.name, path));
    }
  });
}
