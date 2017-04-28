import { handleError } from '../extension/error-handler';

export default async function die(err) {
  await handleError(err);
  process.exit(1);
}
