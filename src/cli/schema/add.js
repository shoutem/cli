import { createSchema } from '../../commands/schema';
import msg from '../../user_messages';

export const description = 'Add schema to current extension';
export const command = 'add <name>';
export function handler(args) {
  createSchema(args.name, (err, path) => {
    if (err) console.log(err.message);
    else console.log(msg.schema.add.complete(args.name, path));
  });
}
