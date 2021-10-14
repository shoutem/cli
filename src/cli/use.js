import { setHostEnvName } from '../clients/server-env';
import msg from '../user_messages';
import { getValue } from '../services/cache-env';

export const description = null;
export const command = 'use <server>';

const production = {
  command: 'production',
  description: 'Switches to the Shoutem production environment.',
  async handler() {
    await setHostEnvName('production');
    console.log(msg.use.complete('production', await getValue('developer')));
  },
};

const dev = {
  command: 'dev',
  description: 'Switches to the Shoutem dev environment.',
  async handler() {
    await setHostEnvName('dev');
    console.log(msg.use.complete('dev', await getValue('developer')));
  },
};

const local = {
  command: 'local',
  description:
    'Switches to the local environment, using endpoints set in OS environment variables.',
  async handler() {
    await setHostEnvName('local');
    console.log(msg.use.complete('local', await getValue('developer')));
  },
};

const qa = {
  command: 'qa',
  description: 'Switches to the Shoutem QA environment.',
  async handler() {
    await setHostEnvName('qa');
    console.log(msg.use.complete('qa', await getValue('developer')));
  },
};

export function builder(use) {
  return use
    .command(production)
    .command(dev)
    .command(local)
    .command(qa)
    .strict();
}
