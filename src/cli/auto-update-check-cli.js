import { executeAndHandleError } from '../services/error-handler';
import { autoUpdateCheckCli } from '../commands/auto-update-check-cli';

export const description = 'Automatically check if CLI should be updated.';

export const command = 'auto-update-check-cli';
export const builder = yargs => {
  return yargs
    .options({
      enable: {
        alias: 'e',
        description: 'Enables automatic CLI update check.',
        type: 'boolean',
      },
      disable: {
        alias: 'd',
        description: 'Disables automatic CLI update check.',
        type: 'boolean',
      },
    })
    .usage(`shoutem ${command} [options]\n\n${description}`);
};

export async function handler(args) {
  await executeAndHandleError(() => autoUpdateCheckCli(args, process.cwd()));
}
