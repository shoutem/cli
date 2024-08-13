import { executeAndHandleError } from '../services/error-handler';
import { autoUpdateCli } from '../commands/auto-update-cli';

export const description = 'Automatically check if CLI should be updated.';

export const command = 'auto-update-cli';
export const builder = yargs => {
  return yargs
    .options({
      enable: {
        alias: 'e',
        description: 'Enables automatic check if CLI should be updated.',
        type: 'boolean',
      },
      disable: {
        alias: 'd',
        description: 'Disables automatic check if CLI should be updated.',
        type: 'boolean',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  await executeAndHandleError(() => autoUpdateCli(args, process.cwd()));
}
