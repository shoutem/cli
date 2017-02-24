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
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, FORCE_COLOR: true },
    capture: ['stdout', 'stderr']
  };

  taskArgs = taskArgs.map(arg => _.includes(arg, ' ') ? `"${arg}"` : arg);

  const spawned = taskArgs.length ?
    spawn('npm', ['run', task, '--', ...taskArgs], opts) :
    spawn('npm', ['run', task], opts);

  const { childProcess } = spawned;

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  const { stdout, stderr } = await spawned;

  return { stdout: stripAnsi(stdout), stderr: stripAnsi(stderr) };
}
