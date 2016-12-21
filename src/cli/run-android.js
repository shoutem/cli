import shoutemRunCommand from '../commands/shoutem-run';

export const description = 'Run shoutem application on android platform';
export const command = 'run-android [appId]';
export function handler(args) {
  shoutemRunCommand('android', args.appId)
    .catch(err => console.log(err.message || err));
}
