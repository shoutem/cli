import { spawn } from 'child-process-promise';
import msg from '../user_messages';
import commandExists from './command-exists';

export async function ensureYarnInstalled() {
  if (!await commandExists('yarn')) {
    throw new Error(msg.yarn.missing());
  }
}

export async function install(cwd = process.cwd()) {
  await ensureYarnInstalled();
  await spawn('yarn', ['install'], { cwd, stdio: 'inherit' });
}

export async function run(cwd, task, taskArgs = null, stdio = 'inherit') {
  await ensureYarnInstalled();
  const opts = {cwd, stdio };

  if (taskArgs) {
    return spawn('yarn', ['run', task, '--', ...taskArgs], opts);
  } else {
    return spawn('yarn', ['run', task], opts);
  }
}
