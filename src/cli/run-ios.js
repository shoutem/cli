import shoutemRunCommand from '../commands/shoutem-run';
import { ensureCocoaPodsInstalled } from '../extension/cocoa-pods';
import msg from '../user_messages';

export const description = 'Run shoutem application on ios platform';
export const command = 'run-ios [appId]';
export const builder = {
  platformBuild: {
    alias: 'p',
    description: 'use external platform build tool'
  },
  release: {
    alias: 'r',
    description: 'true for release build, false for debug build',
    type: 'boolean'
  },
  device: {
    alias: 'd',
    description: 'run app on a specific device'
  },
  simulator: {
    alias: 's',
    description: 'run app on a specific simulator'
  }
};

export async function handler(args) {
  try {
    if (process.platform !== 'darwin') {
      console.log(msg.ios.notOnMac());
      return null;
    }
    await ensureCocoaPodsInstalled();
    await shoutemRunCommand('ios', args.appId, args)
  } catch (err) {
    console.error(err.message || err);
  }
}
