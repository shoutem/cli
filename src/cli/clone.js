import { executeAndHandleError } from '../services/error-handler';
import { clone } from '../commands/clone';

export const description = "Downloads a Shoutem app with all it's extensions.";
export const command = 'clone [appId]';
export const builder = yargs => {
  return yargs
    .options({
      platform: {
        alias: 'p',
        description: 'Uses external mobile app (ignores platform settings).',
        requiresArg: true,
      },
      noconfigure: {
        description: 'Skips platform configuration step.',
        type: 'boolean',
      },
      dir: {
        description: 'Specifies directory name for the cloned app.',
        requiresArg: true,
      },
      force: {
        alias: 'f',
        description: 'Destroys destination directory if it already exists.',
        type: 'boolean',
      },
      segments: {
        description:
          'Specifies which extension segments will be unpacked (app,server,cloud).',
        requiresArg: true,
      },
    })
    .usage(`shoutem ${command} \n\n${description}`);
};

export async function handler(args) {
  await executeAndHandleError(() => clone(args, process.cwd()));
}
