import buildAndroid from '../commands/build';
import { handleError } from '../extension/error-handler';

export const description = 'Build android app for production';
export const command = 'build-android [appId]';
export const builder = yargs => {
  return yargs.options({
    noclean: {
      type: 'boolean',
      description: 'skip clean step, reuse previous build or run'
    },
    noconfigure: {
      type: 'boolean',
      description: 'skip configure step, reuse previous build or run'
    }
  });
};

export async function handler(args) {
  try {
    await buildAndroid('android', args);
  } catch (err) {
    await handleError(err);
  }
}
