import { spawn } from 'superspawn';

export async function install(cwd = process.cwd()) {
  await spawn('npm', ['install'], {cwd, stdio: 'inherit'});
}

export async function run(cwd, task, taskArgs = null, stdio = 'inherit') {
  const opts = {cwd, stdio };

  if (taskArgs) {
    return await spawn('npm', ['run', task, '--', ...taskArgs], opts);
  } else {
    return await spawn('npm', ['run', task], opts);
  }
}
