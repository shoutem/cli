import shoutemRunCommand from '../commands/shoutem-run';
import { ensureCocoaPodsInstalled } from '../extension/cocoa-pods';
import msg from '../user_messages';

export const description = 'Run shoutem application on ios platform';
export const command = 'run-ios [appId]';

export async function handler(args) {
  try {
    if (process.platform !== 'darwin') {
      console.log(msg.ios.notOnMac());
      return;
    }
    await ensureCocoaPodsInstalled();
    await shoutemRunCommand('ios', args.appId, args)
  } catch (err) {
    console.error(err.message || err);
  }
}
