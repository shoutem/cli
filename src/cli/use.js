import { setHostEnvName } from '../clients/server-env';
import msg from '../user_messages';
import { getValue } from '../extension/cache-env';

export const description = null;
export const command = 'use <server>';

const production = {
  command: 'production',
  description: 'Switch to shoutem live env',
  async handler() {
    await setHostEnvName('production');
    console.log(msg.use.complete('production', await getValue('developer')));
  }
};

const dev = {
  command: 'dev',
  description: 'Switch to sauros dev env',
  async handler() {
    await setHostEnvName('dev');
    console.log(msg.use.complete('dev', await getValue('developer')));
  }
};

const local = {
  command: 'local',
  description: 'Use api endpoints set in OS env variables',
  async handler() {
    await setHostEnvName('local');
    console.log(msg.use.complete('local', await getValue('developer')));
  }
};

const qa = {
  command: 'qa',
  description: 'Switch to using sauros qa env',
  async handler() {
    await setHostEnvName('qa');
    console.log(msg.use.complete('qa', await getValue('developer')));
  }
};

export function builder(use) {
  return use
    .command(production)
    .command(dev)
    .command(local)
    .command(qa)
    .strict();
}
