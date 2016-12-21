import msg from '../user_messages';
import commandExists from './command-exists';

export async function ensureCocoaPodsInstalled() {
  if (!await commandExists('pod')) {
    throw new Error(msg.cocoapods.missing());
  }
}
