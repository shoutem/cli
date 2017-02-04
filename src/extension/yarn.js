import { spawn } from 'superspawn';
import msg from '../user_messages';
import commandExists from '../extension/command-exists';
import semver from 'semver';

export async function ensureYarnInstalled(minVersion = '0.17.10') {
  if (!await commandExists('yarn')) {
    throw new Error(msg.yarn.missing());
  }

  const version = await spawn('yarn', ['-V']);

  if (semver.gt(minVersion, version)) {
    throw new Error(msg.yarn.outdated(minVersion));
  }
}

export async function install(cwd = process.cwd()) {
  await ensureYarnInstalled();
  await spawn('yarn', ['install'], {cwd, stdio: 'inherit'});
}

export async function run(cwd, task, taskArgs = null, stdio = 'inherit') {
  await ensureYarnInstalled();
  const opts = {cwd, stdio };

  if (taskArgs) {
    return await spawn('yarn', ['run', task, '--', ...taskArgs], opts);
  } else {
    return await spawn('yarn', ['run', task], opts);
  }
}
