import { spawn } from 'child-process-promise';
import stripAnsi from 'strip-ansi';
import _ from 'lodash';

export async function install(cwd = process.cwd()) {
  await spawn('npm', ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true }
  });
}

export async function run(cwd, task, taskArgs = []) {
  const opts = {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
  };

  taskArgs = taskArgs.map(arg => _.includes(arg, ' ') ? `"${arg}"` : arg);

  const spawned = taskArgs.length ?
    spawn('npm', ['run', task, '--', ...taskArgs], opts) :
    spawn('npm', ['run', task], opts);

  return await spawned;
}
