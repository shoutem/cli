import { setHostEnvName } from '../clients/server-env';
import { getValue } from '../services/cache-env';
import msg from '../user_messages';

export const description = null;
export const command = 'use <server>';

const production = {
  command: 'production',
  description: 'Switch to shoutem live env',
  handler() {
    setHostEnvName('production');
    console.log(msg.use.complete('production', getValue('developer')));
  },
};

const dev = {
  command: 'dev',
  description: 'Switch to sauros dev env',
  handler() {
    setHostEnvName('dev');
    console.log(msg.use.complete('dev', getValue('developer')));
  },
};

const local = {
  command: 'local',
  description: 'Use api endpoints set in OS env variables',
  handler() {
    setHostEnvName('local');
    console.log(msg.use.complete('local', getValue('developer')));
  },
};

const qa = {
  command: 'qa',
  description: 'Switch to using sauros qa env',
  handler() {
    setHostEnvName('qa');
    console.log(msg.use.complete('qa', getValue('developer')));
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
