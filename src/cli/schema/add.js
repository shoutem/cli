import bluebird from 'bluebird';
import { createSchema } from '../../commands/schema';
import msg from '../../user_messages';
import { ensureVariableName } from '../../extension/cli-parsing';
import { handleError } from '../../extension/error-handler';

const createSchemaAsync = bluebird.promisify(createSchema);

export const description = 'Add schema to current extension';
export const command = 'add <name>';
export async function handler(args) {
  try {
    ensureVariableName(args.name);
    const path = await createSchemaAsync(args.name);
    console.log(msg.schema.add.complete(args.name, path));
  } catch (err) {
    await handleError(err);
  }
}
