import {executeAndHandleError} from '../services/error-handler';
import {addExtension} from "./extension/add";

export const command = 'init <name>';
export const description = 'Creates a basic extension structure, with all the required files and folders.';
export const builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`).strict();
};

export const handler = ({ name }) => executeAndHandleError(async () => {
  await addExtension({ name, externalDestination: process.cwd() });
});
