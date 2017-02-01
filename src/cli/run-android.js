import shoutemRunCommand from '../commands/shoutem-run';

export const description = 'Run shoutem application on android platform';
export const command = 'run-android [appId]';
export const builder = {
  platformBuild: {
    alias: 'p',
    description: 'use external platform build tool'
  }
};
export function handler(args) {
  shoutemRunCommand('android', args.appId, args)
    .catch(err => console.log(err.message || err));
}
