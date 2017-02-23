import { spawn } from 'child-process-promise';
import toString from 'stream-to-string';

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
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, FORCE_COLOR: true }
  };

  taskArgs = taskArgs.map(arg => arg.replace(/ /g, '\\ '));

  const spawned = taskArgs.length ?
    spawn('npm', ['run', task, '--', ...taskArgs], opts) :
    spawn('npm', ['run', task], opts);

  const { childProcess } = spawned;

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  const stdPromises = [toString(childProcess.stdout), toString(childProcess.stderr)];
  await spawned;
  return await Promise.all(stdPromises);
}
