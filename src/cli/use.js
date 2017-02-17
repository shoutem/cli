import { setHostEnvName } from '../clients/server-env';
import msg from '../user_messages';
import LocalDataClient from '../clients/local-data';

export const description = null;
export const command = 'use <server>';

const localDataClient = new LocalDataClient();

const production = {
  command: 'production',
  description: 'Switch to shoutem live env',
  async handler() {
    await setHostEnvName('production');
    console.log(msg.use.complete('production', await localDataClient.loadDeveloper()));
  }
};

const dev = {
  command: 'dev',
  description: 'Switch to sauros dev env',
  async handler() {
    await setHostEnvName('dev');
    console.log(msg.use.complete('dev', await localDataClient.loadDeveloper()));
  }
};

const local = {
  command: 'local',
  description: 'Use api endpoints set in OS env variables',
  async handler() {
    await setHostEnvName('local');
    console.log(msg.use.complete('local', await localDataClient.loadDeveloper()));
  }
};

const beta = {
  command: 'beta',
  description: 'Switch to using aperfector beta env',
  async handler() {
    await setHostEnvName('beta');
    console.log(msg.use.complete('beta', await localDataClient.loadDeveloper()));
  }
};

const qa = {
  command: 'qa',
  description: 'Switch to using sauros qa env',
  async handler() {
    await setHostEnvName('qa');
    console.log(msg.use.complete('qa', await localDataClient.loadDeveloper()));
  }
};

export function builder(use) {
  return use
    .command(production)
    .command(dev)
    .command(local)
    .command(beta)
    .command(qa)
    .strict();
}
