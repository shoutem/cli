import {executeAndHandleError} from '../services/error-handler';
import {addExtension} from "./extension/add";

export const command = 'init <name>';
export const description = 'Create a scaffold of all files and folders required to build an extension.';
export const builder = yargs => {
  return yargs.usage(`shoutem ${command}\n\n${description}`).strict();
};

export const handler = ({ name }) => executeAndHandleError(async () => {
  await addExtension({ name, externalDestination: process.cwd() });
});
