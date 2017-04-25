import buildApp from '../commands/build';
import { handleError } from '../extension/error-handler';

export const description = 'Build android app for production';
export const command = 'build-android [appId]';
export const builder = yargs => {
  return yargs.options({
    mobileapp: {
      alias: 'm',
      description: 'use external mobile app (ignores platform settings)',
      requiresArg: true
    },
  });
};

export async function handler(args) {
  try {
    await buildApp('android', args);
  } catch (err) {
    await handleError(err);
  }
}
