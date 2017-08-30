import { spawn } from 'superspawn';
import msg from '../user_messages';
import semver from 'semver';

export async function ensureNodeVersion(minVersion = '7.2.0') {
  let version = await spawn('node', ['-v']);
  if (version.charAt(0) === 'v') {
    version = version.slice(1);
  }

  if (semver.gt(minVersion, version)) {
    throw new Error(msg.node.outdated(minVersion));
  }
}

