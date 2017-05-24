import 'colors';
import prettyJson from 'prettyjson';
import { lastErrorPath } from '../clients/cli-paths';
import { readJsonFile } from '../extension/data';

export const description = null;
export const command = 'last-error';
export async function handler() {
  const lastError = await readJsonFile(await lastErrorPath());
  if (lastError) {
    console.log(prettyJson.render(lastError, {
      keysColor: 'cyan',
      numberColor: 'white'
    }));
  } else {
    console.log('No error'.green);
  }
}
