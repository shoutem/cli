import { setHostEnvName } from '../../clients/server-env';
import { ensureDeveloperIsRegistered } from '../../commands/register';
import msg from '../../user_messages';

export const description = 'Manages server environment used by cli';
export const command = 'use <server>';

const production = {
  command: 'production',
  description: 'Switch to shoutem live env',
  async handler() {
    await setHostEnvName('production');
    console.log(msg.use.complete('production', await ensureDeveloperIsRegistered()));
  }
};

const dev = {
  command: 'dev',
  description: 'Switch to sauros dev env',
  async handler() {
    await setHostEnvName('dev');
    console.log(msg.use.complete('dev', await ensureDeveloperIsRegistered()));
  }
};

const local = {
  command: 'local',
  description: 'Use api endpoints set in OS env variables',
  async handler() {
    await setHostEnvName('local');
    console.log(msg.use.complete('local', await ensureDeveloperIsRegistered()));
  }
};

const beta = {
  command: 'beta',
  description: 'Switch to using aperfector beta env',
  async handler() {
    await setHostEnvName('beta');
    console.log(msg.use.complete('beta', await ensureDeveloperIsRegistered()));
  }
};

const qa = {
  command: 'qa',
  description: 'Switch to using sauros qa env',
  async handler() {
    await setHostEnvName('qa');
    console.log(msg.use.complete('qa', await ensureDeveloperIsRegistered()));
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
