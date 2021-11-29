import { addShortcut } from '../../services/shortcut';

export async function before(context) {
  addShortcut(context.extJson, context);
}
