import { createPage } from '../../commands/page';
import msg from '../../user_messages';

export const description = 'Add page to current extension';
export const command = 'add <name>';
export async function handler(args) {
  try {
    const result = await createPage(args.name);
    console.log(msg.page.add.complete(result));
  } catch (err) {
    console.log(err.message || err);
  }
}
