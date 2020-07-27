import { setHostEnvName } from '../clients/server-env';
import msg from '../user_messages';
import { setDefaultPackageManager } from '../clients/default-package-manager';

export const description = 'Sets your default package manager.';
export const command = 'package-manager <package-manager>';

const npm = {
  command: 'npm',
  description: 'Sets \'npm\' as your default package manager.',
  async handler() {
    setDefaultPackageManager('npm');
    console.log(msg.packageManager.complete('npm');
  }
};

const yarn = {
  command: 'yarn',
  description: 'Sets \'yarn\' as your default package manager.',
  async handler() {
    setDefaultPackageManager('yarn');
    console.log(msg.packageManager.complete('yarn');
  }
};

export function builder(packageManager) {
  return packageManager
    .command(npm)
    .command(yarn)
    .strict();
}
